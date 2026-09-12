# Task Management

A responsive **Task Management application** built with Angular as part of a frontend machine task. The application provides task creation, editing, deletion, detailed task views, rich-text descriptions, and a nested commenting system with unlimited replies.

## Features

### Task Management

* View all tasks in a clean, responsive interface
* Create new tasks
* Edit existing tasks
* Delete tasks with confirmation
* View complete task details
* Display task description preview in the task list
* Display task deadline
* Display task status:

  * Pending
  * In Progress
  * Completed
* Unique Task ID for every task

### Task Details

Selecting a task navigates to a dedicated **Task Details** page.

The details page displays:

* Task title
* Complete task description
* Deadline
* Task ID
* Current status
* Comments and replies

### Rich Text Description

Task descriptions support rich-text formatting.

Supported formatting includes:

* **Bold**
* *Italic*
* <u>Underline</u>
* Bullet lists

Rich-text content is rendered correctly on the task details page.

### Comments

The application includes a complete commenting system.

Users can:

* Add comments to a task
* Reply to comments
* Reply to replies
* Create unlimited levels of nested replies
* View comment author and timestamp

Comments are handled locally in memory since backend persistence is not required for this task.

The nested comment structure is implemented recursively using a reusable Angular component.

## Tech Stack

* **Angular 21**
* **TypeScript**
* **HTML5**
* **SCSS**
* **Bootstrap**
* **Bootstrap Icons**
* **RxJS**
* **Angular Reactive Forms**
* **Angular HttpClient**

## Project Structure

The application follows a component-based Angular structure with responsibilities separated between components and services.

```text
src/
├── app/
│   ├── pages/
│   │   ├── home/
│   │   ├── task-details/
│   │
│   ├── components/
│   │   ├── shared/
│   │        ├── task-form
│   │        ├── comment-item
│   │
│   ├── services/
│   │   ├── task/
│   │        ├── task.service.ts
│   │   ├── comment/
│   │        ├── comment.service
│   │
│   ├── interfaces/
│   │   ├── task.ts
│   │   └── comment.ts
│   │
│   ├── constants/
│   │   ├── constants.ts
│   │   └── routes.ts
│   │
│   └── app.routes.ts
│
├── assets/
│   └── tasks.json
│
└── styles.scss
```

## Data Loading

Initial task data is stored in:

```text
src/assets/tasks.json
```

The application loads the task data using Angular's `HttpClient`.

This keeps the initial task data separate from the application logic and allows the task list to be populated without requiring a backend API.

## Task State Management

Task operations are handled through a dedicated `TaskService`.

The service is responsible for:

* Loading tasks from `tasks.json`
* Maintaining the current task state
* Finding a task by ID
* Adding tasks
* Updating tasks
* Deleting tasks
* Providing task data to components

RxJS `BehaviorSubject` is used to maintain and distribute the current task state across components.

## Comment Architecture

Comments are managed separately from tasks using a dedicated `CommentService`.

Each comment contains:

```text
Comment
├── id
├── taskId
├── author ('You')
├── content
├── createdAt
└── replies[]
```

The `replies` property contains other `Comment` objects, allowing comments to contain replies recursively.

A reusable `CommentItemComponent` renders each comment and recursively renders its nested replies.

This approach supports unlimited reply depth without requiring separate components for each nesting level.

## Forms & Validation

Task creation and editing use Angular Reactive Forms.

Validation includes:

* Required task title
* Maximum title length
* Required description
* Maximum description length
* Required deadline
* Future-date validation
* Required task status

Invalid form submissions are prevented until the required fields are valid.

## Routing

The application uses Angular Router for navigation.

The task details page uses the task ID as a route parameter.

Example:

```text
/task-details/:id
```

When a user selects **View** from the task list, the application navigates to the corresponding task details page.

## UI & Responsiveness

The application uses **Bootstrap** together with custom SCSS styling.

The interface is designed to be:

* Clean
* Minimal
* Responsive
* Consistent across pages
* Mobile-friendly

The task list, task form, task details, comments, and nested replies adapt to smaller screen sizes.

## Getting Started

### Installation

Clone the repository:

```bash
git clone https://github.com/adeebmuhammed/task-management.git
```

Navigate to the project directory:

```bash
cd task-management
```

Install dependencies:

```bash
npm install
```

### Development Server

Start the Angular development server:

```bash
ng serve
```

Open your browser and navigate to:

```text
http://localhost:4200/
```

The application will automatically reload whenever source files are modified.

## Build

To create a production build:

```bash
ng build
```

The generated build files will be available inside:

```text
dist/
```

## Testing

### Unit Tests

Run unit tests using:

```bash
ng test
```

### End-to-End Tests

Run end-to-end tests using:

```bash
ng e2e
```

Angular does not include an end-to-end testing framework by default, so an appropriate framework can be configured if required.

## Key Implementation Highlights

* Standalone Angular components
* Component-based architecture
* Reusable task form component
* Reusable recursive comment component
* Angular Reactive Forms
* Custom form validators
* HttpClient-based task loading
* RxJS-based task state management
* Route-based task details
* Rich-text task descriptions
* Unlimited nested comment replies
* Responsive Bootstrap UI
* Separation of UI, service, and model responsibilities

## Project Status

The application implements the core requirements of the Task Management machine task, including task CRUD operations, task details, rich-text descriptions, and nested comments/replies.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
