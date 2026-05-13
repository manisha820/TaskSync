import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, MessageSquare, CheckCircle2, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../auth/AuthProvider';
import { getOrCreateDefaultBoard } from '../../lib/api/boards';
import { fetchTasks, updateTaskStatus, createTask, Task as DBTask } from '../../lib/api/tasks';
import { supabase } from '../../lib/supabase';

interface Column {
  id: string;
  title: string;
  count: number;
  tasks: DBTask[];
  color: string;
  shadow: string;
}

const emptyBoard: Record<string, Column> = {
  'Todo': { id: 'Todo', title: 'Todo', count: 0, tasks: [], color: 'bg-surface-bright', shadow: 'shadow-none' },
  'In Progress': { id: 'In Progress', title: 'In Progress', count: 0, tasks: [], color: 'bg-primary', shadow: 'shadow-none' },
  'Done': { id: 'Done', title: 'Done', count: 0, tasks: [], color: 'bg-surface-dim', shadow: 'shadow-none' },
};

interface KanbanBoardProps {
  openModal?: (tab: 'task' | 'note' | 'habit' | 'event', status?: string) => void;
}

export function KanbanBoard({ openModal }: KanbanBoardProps) {
  const { user } = useAuth();
  const [boardId, setBoardId] = useState<string | null>(null);
  const [columns, setColumns] = useState<Record<string, Column>>(emptyBoard);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Board & Tasks
  useEffect(() => {
    if (!user) return;
    
    const loadBoard = async () => {
      const board = await getOrCreateDefaultBoard(user.id);
      if (board) {
        setBoardId(board.id);
        const tasks = await fetchTasks(board.id);
        distributeTasks(tasks, board.columns);
      }
      setIsLoading(false);
    };

    loadBoard();
  }, [user]);

  // 2. Realtime Subscription
  useEffect(() => {
    if (!boardId) return;

    const channel = supabase.channel('tasks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks', filter: `board_id=eq.${boardId}` }, async () => {
        // Simple strategy: refetch on any change from other clients
        const tasks = await fetchTasks(boardId);
        distributeTasks(tasks, Object.keys(columns));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boardId]);

  const distributeTasks = (tasks: DBTask[], columnNames: string[]) => {
    const newColumns: Record<string, Column> = {};
    
    // Initialize columns
    columnNames.forEach(col => {
      newColumns[col] = {
        id: col,
        title: col,
        count: 0,
        tasks: [],
        color: col === 'In Progress' ? 'bg-primary' : 'bg-surface-bright',
        shadow: 'shadow-none'
      };
    });

    // Populate tasks
    tasks.forEach(task => {
      if (newColumns[task.status]) {
        newColumns[task.status].tasks.push(task);
        newColumns[task.status].count += 1;
      }
    });

    setColumns(newColumns);
  };

  const handleAddTask = (columnId: string) => {
    if (openModal) {
      openModal('task', columnId);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Dropped in the same spot
    }

    const startCol = columns[source.droppableId];
    const finishCol = columns[destination.droppableId];

    if (startCol === finishCol) {
      // Reordering in same column
      const newTaskIds = Array.from(startCol.tasks);
      const [movedTask] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, movedTask);

      setColumns({
        ...columns,
        [startCol.id]: { ...startCol, tasks: newTaskIds },
      });
      return;
    }

    // Moving across columns (Optimistic Update)
    const startTaskIds = Array.from(startCol.tasks);
    const [movedTask] = startTaskIds.splice(source.index, 1);
    
    // Update the task status to match new column
    movedTask.status = destination.droppableId;

    const finishTaskIds = Array.from(finishCol.tasks);
    finishTaskIds.splice(destination.index, 0, movedTask);

    setColumns({
      ...columns,
      [startCol.id]: { ...startCol, tasks: startTaskIds, count: startCol.count - 1 },
      [finishCol.id]: { ...finishCol, tasks: finishTaskIds, count: finishCol.count + 1 },
    });

    // Fire deterministic backend function
    await updateTaskStatus(draggableId, destination.droppableId);
  };

  if (isLoading) {
    return <div className="p-8 text-text-muted">Loading Board...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar h-full items-start">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="w-[340px] shrink-0 flex flex-col h-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-none mb-6 shadow-lg text-text-primary",
                column.color,
                column.shadow
              )}>
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 w-8 h-8 rounded-none flex items-center justify-center text-xs font-bold">
                    {column.count}
                  </span>
                  <span className="font-bold">{column.title}</span>
                </div>
                <button 
                  onClick={() => handleAddTask(column.id)}
                  className="hover:bg-white/10 p-1 rounded-none"
                >
                  <Plus size={20} />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4 min-h-[200px] transition-colors rounded-none p-1",
                      snapshot.isDraggingOver ? "bg-surface-dim/50" : ""
                    )}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "bg-surface-bright border border-white/10 p-5 rounded-none shadow-sm hover:shadow-md transition-all",
                              snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20 scale-105" : ""
                            )}
                          >
                            <span className={cn(
                              "text-[10px] font-bold px-2.5 py-1 rounded-none uppercase tracking-wider",
                              task.priority === 'High' ? "bg-red-500/20 text-red-400" : "bg-surface-dim text-text-muted"
                            )}>
                              {task.priority}
                            </span>
                            <h3 className="mt-3 font-bold text-text-primary leading-snug group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            {task.description && (
                                <p className="mt-2 text-sm text-text-muted line-clamp-2">
                                  {task.description}
                                </p>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
