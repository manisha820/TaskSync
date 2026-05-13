# Data Schema & Maintenance Log

## JSON Data Schema (Input/Output shapes)

The primary source of truth is a PostgreSQL database. Below are the core entity shapes expected in the application.

### Users
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "avatar_url": "string (optional)",
  "preferences": {
    "theme": "string (light/dark)",
    "notifications_enabled": "boolean"
  },
  "created_at": "timestamp"
}
```

### Tasks
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "board_id": "uuid",
  "title": "string",
  "description": "text",
  "status": "string (todo, in_progress, done)",
  "priority": "string (low, medium, high)",
  "due_date": "timestamp (optional)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Kanban Boards
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "columns": "array[string]",
  "created_at": "timestamp"
}
```

### Notes
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "content": "text (markdown/rich text)",
  "tags": "array[string]",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Calendar Events
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "title": "string",
  "start_time": "timestamp",
  "end_time": "timestamp",
  "is_all_day": "boolean",
  "location": "string (optional)",
  "description": "text (optional)",
  "created_at": "timestamp"
}
```

### Pomodoro Sessions
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "task_id": "uuid (optional)",
  "duration_minutes": "integer",
  "completed_at": "timestamp"
}
```

## Maintenance Log
*To be populated during the Trigger (Deployment) Phase*
