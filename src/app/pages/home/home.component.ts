import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../../components/shared/task-form/task-form.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TaskFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  isEditMode = false;
  isLoading = false;
  errorMessage = '';
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  //load tasks
  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },

      error: (error) => {
        console.error('Failed to load tasks:', error);

        this.errorMessage = 'Unable to load tasks. Please try again.';

        this.isLoading = false;
      },
    });
  }

  // Open add task modal
  openAddTaskModal(): void {
    console.log("add task clicked");
    
    this.selectedTask = null;
    this.isEditMode = false;
  }

  // Open edit task modal
  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.isEditMode = true;
  }

  //delete task
  deleteTask(task: Task): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.tasks = this.tasks.filter((item) => item.id !== task.id);
  }

  //view task
  viewTask(task: Task): void {
    this.selectedTask = task;

    console.log('Viewing task:', task);

    // Open view modal here
  }

  /**
   * Receive newly added task
   */
  onTaskAdded(task: Task): void {
    this.tasks = [...this.tasks, task];
  }

  /**
   * Receive updated task
   */
  onTaskUpdated(updatedTask: Task): void {
    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
  }
}
