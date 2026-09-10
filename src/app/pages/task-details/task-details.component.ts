import { Component, inject, Inject, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { routes } from '../../app.routes';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-details',
  imports: [ DatePipe ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss'
})
export class TaskDetailsComponent implements OnInit {
  selectedTask: Task | null = null;

  constructor(){}

  private activatedRoute = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  taskId: string = this.activatedRoute.snapshot.paramMap.get('id') || '';

  ngOnInit(): void {
    this.loadTaskDetails(Number(this.taskId));
  }

  loadTaskDetails(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.selectedTask = task || null;
      },
      error: (error) => {
        console.error('Failed to load task:', error);
        this.selectedTask = null;
      }
    });
  }
}
