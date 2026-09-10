import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Task, TaskStatus } from '../../../interfaces/task';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit,OnChanges {
  taskForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  minDate = '';

  @Input() isEditMode = false;
  @Input() selectedTask: Task | null = null;

  @Output() taskAdded = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    
    this.minDate = this.formatDate(new Date());

    this.initializeForm();
  }

  ngOnChanges(): void {
    if (this.selectedTask) {
      this.taskForm.patchValue({
        title: this.selectedTask.title,
        description: this.selectedTask.description,
        deadline: this.selectedTask.deadline,
        status: this.selectedTask.status,
      });
    }
  }

  //intialize form with validators
  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],

      description: ['', [Validators.required, Validators.maxLength(500)]],

      deadline: ['', [Validators.required, this.futureDateValidator]],

      status: ['Pending', Validators.required],
    });
  }

  //date validator
  futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        pastDate: true,
      };
    }

    return null;
  }

  //open add taskmodal
  openAddTaskModal(): void {
    console.log("add task modal");
    
    this.isEditMode = false;

    this.selectedTask = null;

    this.taskForm.reset({
      title: '',
      description: '',
      deadline: '',
      status: 'Pending',
    });

    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();
  }

  //open edit task modal
  openEditTaskModal(task: Task): void {
    console.log(task);
    
    this.isEditMode = true;

    this.selectedTask = task;

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      status: task.status,
    });
  }

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

  //add task
  private addTask(formValue: {
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
  }): void {
    const newTask: Task = {
      id: Date.now(),

      title: formValue.title.trim(),

      description: formValue.description.trim(),

      deadline: formValue.deadline,

      status: formValue.status,
    };

    this.taskAdded.emit(newTask);
  }

  //update task
  private updateTask(formValue: {
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
  }): void {
    if (!this.selectedTask) {
      return;
    }

    const updatedTask: Task = {
      ...this.selectedTask,

      title: formValue.title.trim(),

      description: formValue.description.trim(),

      deadline: formValue.deadline,

      status: formValue.status,
    };

    this.taskUpdated.emit(updatedTask);
  }

  //date formatting
  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  //form getters
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
