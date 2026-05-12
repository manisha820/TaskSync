import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, MessageSquare, CheckCircle2, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low' | 'Important' | 'Meh' | 'OK';
  priorityColor: string;
  comments: number;
  checks: number;
  assignees: string[];
}

interface Column {
  id: string;
  title: string;
  count: number;
  tasks: Task[];
  color: string;
  shadow: string;
}

const initialData: Record<string, Column> = {
  'in-progress': {
    id: 'in-progress',
    title: 'In Progress',
    count: 25,
    color: 'bg-[#5D5FEF]',
    shadow: 'shadow-indigo-100',
    tasks: [
      {
        id: 'task-1',
        title: 'UI/UX Design in the age of AI',
        description: 'Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.',
        priority: 'Important',
        priorityColor: 'bg-blue-50 text-blue-500',
        comments: 11,
        checks: 187,
        assignees: ['U1', 'U2']
      },
      {
        id: 'task-2',
        title: 'Responsive Website Design for 23 more clients',
        description: 'Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.',
        priority: 'Meh',
        priorityColor: 'bg-indigo-50 text-indigo-400',
        comments: 32,
        checks: 115,
        assignees: ['U1', 'U2', 'U3']
      },
      {
        id: 'task-3',
        title: 'Blog Copywriting (Low priority 😅)',
        description: 'Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.',
        priority: 'OK',
        priorityColor: 'bg-orange-50 text-orange-400',
        comments: 987,
        checks: 21.8,
        assignees: ['U1', 'U2']
      }
    ]
  },
  'reviewed': {
    id: 'reviewed',
    title: 'Reviewed',
    count: 8,
    color: 'bg-[#F2994A]',
    shadow: 'shadow-orange-100',
    tasks: [
      {
        id: 'task-4',
        title: 'User flow confirmation for finance app',
        description: 'Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.',
        priority: 'Important',
        priorityColor: 'bg-blue-50 text-blue-500',
        comments: 8,
        checks: 112,
        assignees: ['U1']
      },
      {
        id: 'task-5',
        title: 'Healthcare app wireframe flow 👨‍⚕️',
        description: 'Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.',
        priority: 'Important',
        priorityColor: 'bg-blue-50 text-blue-500',
        comments: 221,
        checks: 87.2,
        assignees: ['U1', 'U2', 'U3']
      }
    ]
  },
  'completed': {
    id: 'completed',
    title: 'Completed',
    count: 2,
    color: 'bg-[#27AE60]',
    shadow: 'shadow-green-100',
    tasks: [
      {
        id: 'task-6',
        title: 'Final UI Review',
        description: 'Lorem ipsum dolor sit amet, libre unst consectetur adipiscing elit.',
        priority: 'High',
        priorityColor: 'bg-red-50 text-red-500',
        comments: 108,
        checks: 997,
        assignees: ['U1', 'U2']
      }
    ]
  }
};

export function KanbanBoard() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.tasks);
      const [movedTask] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, movedTask);

      const newColumn = {
        ...start,
        tasks: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.tasks);
    const [movedTask] = startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      tasks: startTaskIds,
      count: start.count - 1
    };

    const finishTaskIds = Array.from(finish.tasks);
    finishTaskIds.splice(destination.index, 0, movedTask);
    const newFinish = {
      ...finish,
      tasks: finishTaskIds,
      count: finish.count + 1
    };

    setColumns({
      ...columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar h-full items-start">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="w-[340px] shrink-0 flex flex-col h-full">
              <div className={cn(
                "flex items-center justify-between p-4 rounded-2xl mb-6 shadow-lg text-white",
                column.color,
                column.shadow
              )}>
                <div className="flex items-center gap-3">
                  <span className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold">
                    {column.count}
                  </span>
                  <span className="font-bold">{column.title}</span>
                </div>
                <button className="hover:bg-white/10 p-1 rounded-lg">
                  <Plus size={20} />
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4 min-h-[200px] transition-colors rounded-3xl p-1",
                      snapshot.isDraggingOver ? "bg-slate-100/50" : ""
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
                              "bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all",
                              snapshot.isDragging ? "shadow-xl ring-2 ring-primary/20 scale-105" : ""
                            )}
                          >
                            <span className={cn(
                              "text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider",
                              task.priorityColor || "bg-slate-100 text-slate-500"
                            )}>
                              {task.priority}
                            </span>
                            <h3 className="mt-3 font-bold text-gray-800 leading-snug group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                              {task.description}
                            </p>
                            <div className="mt-5 flex items-center justify-between">
                              <div className="flex -space-x-2">
                                {task.assignees.map((_, i) => (
                                  <div 
                                    key={i} 
                                    className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500"
                                  >
                                    <User size={14} />
                                  </div>
                                ))}
                                {task.assignees.length > 2 && (
                                  <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-500">
                                    +{task.assignees.length - 2}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-gray-400">
                                <div className="flex items-center gap-1">
                                  <MessageSquare size={14} />
                                  <span className="text-xs font-bold">{task.comments}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 size={14} />
                                  <span className="text-xs font-bold">{task.checks}k</span>
                                </div>
                              </div>
                            </div>
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
