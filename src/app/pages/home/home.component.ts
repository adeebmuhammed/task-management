import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../../components/shared/task-form/task-form.component';
import { Router } from '@angular/router';
import { ROUTES_PATHS } from '../../constants/routes';

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

  constructor() {}

  private taskService = inject(TaskService);
  private router = inject(Router);

  ngOnInit(): void {
    this.loadTasks();

    this.taskService.tasks$.subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
    });
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
    this.selectedTask = null;
    this.isEditMode = false;
  }

  // Open edit task modal
  openEditTaskModal(task: Task): void {
    this.selectedTask = task;
    this.isEditMode = true;
  }

  private closeModal(): void {
    const modalElement = document.getElementById('taskModal');

    if (!modalElement) {
      return;
    }

    const modal = (window as any).bootstrap?.Modal.getInstance(modalElement);

    modal?.hide();
  }

  //delete task
  deleteTask(task: Task): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    this.taskService.deleteTask(task.id);
  }

  //view task
  viewTask(task: Task): void {
    this.router.navigate([ROUTES_PATHS.TASK_DETAILS, task.id]);
  }

  onTaskAdded(task: Task): void {
    console.log('task added', task);

    this.taskService.addTask(task);
    this.closeModal();
  }

  onTaskUpdated(updatedTask: Task): void {
    this.taskService.updateTask(updatedTask);
    this.closeModal();
  }
}
