import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [ CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  task : any;

  tasks: any[] = []

  isLoading = false;

  errorMessage = '';


  openAddTaskModal(): void {
    // Logic to open the modal for adding a new task
  }

  openEditTaskModal(task: any): void {
    // Logic to open the modal for editing the selected task
  }

  deleteTask(task: any): void {
    // Logic to delete the selected task
  }

  viewTask( task: any): void {
    // Logic to view the details of the selected task
  }

  loadTasks(): void {
    // Logic to load tasks from the backend or any data source
  }
}
