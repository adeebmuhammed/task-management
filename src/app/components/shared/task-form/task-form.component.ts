import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../../interfaces/task';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  tasks: Task[] = [];

  taskForm!: FormGroup;

  isEditMode = false;

  selectedTask: Task | null = null;

  isLoading = false;

  errorMessage = '';

  minDate = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.minDate = this.formatDate(new Date());

    this.initializeForm();

    this.loadTasks();
  }

  /**
   * Initialize Reactive Form
   */
  private initializeForm(): void {

    this.taskForm = this.fb.group({

      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.required,
          Validators.maxLength(500)
        ]
      ],

      deadline: [
        '',
        [
          Validators.required,
          this.futureDateValidator
        ]
      ],

      status: [
        'Pending',
        Validators.required
      ]

    });
  }

  /**
   * Load tasks from assets/tasks.json
   */
  loadTasks(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.http
      .get<Task[]>('assets/tasks.json')
      .subscribe({

        next: (tasks) => {

          this.tasks = tasks;

          this.isLoading = false;

        },

        error: (error) => {

          console.error('Failed to load tasks:', error);

          this.errorMessage =
            'Unable to load tasks. Please try again.';

          this.isLoading = false;

        }

      });
  }

  /**
   * Custom deadline validator
   */
  futureDateValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {

      return {
        pastDate: true
      };

    }

    return null;
  }

  /**
   * Open Add Task modal
   */
  openAddTaskModal(): void {

    this.isEditMode = false;

    this.selectedTask = null;

    this.taskForm.reset({
      title: '',
      description: '',
      deadline: '',
      status: 'Pending'
    });

    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();
  }

  /**
   * Open Edit Task modal
   */
  openEditTaskModal(task: Task): void {

    this.isEditMode = true;

    this.selectedTask = task;

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      status: task.status
    });

  }

  /**
   * Add / Update Task
   */
  onSubmit(): void {

    if (this.taskForm.invalid) {

      this.taskForm.markAllAsTouched();

      return;
    }

    const formValue = this.taskForm.value;

    if (this.isEditMode && this.selectedTask) {

      this.updateTask(formValue);

    } else {

      this.addTask(formValue);

    }

  }

  /**
   * Add new task
   */
  private addTask(formValue: {
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
  }): void {

    const newTask: Task = {

      id: this.generateTaskId(),

      title: formValue.title.trim(),

      description: formValue.description.trim(),

      deadline: formValue.deadline,

      status: formValue.status

    };

    this.tasks = [
      ...this.tasks,
      newTask
    ];

    console.log('Task added:', newTask);

    this.closeModal();

  }

  /**
   * Update existing task
   */
  private updateTask(formValue: {
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
  }): void {

    if (!this.selectedTask) {
      return;
    }

    this.tasks = this.tasks.map(task => {

      if (task.id !== this.selectedTask?.id) {
        return task;
      }

      return {
        ...task,

        title: formValue.title.trim(),

        description: formValue.description.trim(),

        deadline: formValue.deadline,

        status: formValue.status

      };

    });

    console.log(
      'Task updated:',
      this.selectedTask.id
    );

    this.closeModal();

  }

  /**
   * Delete task
   */
  deleteTask(task: Task): void {

    const confirmed = confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.tasks = this.tasks.filter(
      item => item.id !== task.id
    );

    console.log('Task deleted:', task.id);

  }

  /**
   * View task
   */
  viewTask(task: Task): void {

    this.selectedTask = task;

    console.log('Viewing task:', task);

    // You can later open a separate
    // View Task modal here.
  }

  /**
   * Generate ID for newly added task
   */
  private generateTaskId(): number {

    if (this.tasks.length === 0) {
      return 1;
    }

    return Math.max(
      ...this.tasks.map(task => task.id)
    ) + 1;

  }

  /**
   * Format date for HTML date input
   */
  private formatDate(date: Date): string {

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Close Bootstrap modal
   */
  private closeModal(): void {

    const modalElement =
      document.getElementById('taskModal');

    if (!modalElement) {
      return;
    }

    const modal =
      (window as any).bootstrap?.Modal
        .getInstance(modalElement);

    modal?.hide();

  }

  /**
   * Form getters
   */
  get titleControl(): AbstractControl {
    return this.taskForm.get('title')!;
  }

  get descriptionControl(): AbstractControl {
    return this.taskForm.get('description')!;
  }

  get deadlineControl(): AbstractControl {
    return this.taskForm.get('deadline')!;
  }

  get statusControl(): AbstractControl {
    return this.taskForm.get('status')!;
  }
}
