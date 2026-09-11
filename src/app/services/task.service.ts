import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Task } from '../interfaces/task';
import { tasksUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly tasksUrl = `${tasksUrl}`;

  private tasksSubject = new BehaviorSubject<Task[]>([]);

  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    if (this.tasksSubject.value.length > 0) {
      return this.tasks$;
    }

    return this.http
      .get<Task[]>(this.tasksUrl)
      .pipe(tap((tasks) => this.tasksSubject.next(tasks)));
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.tasks$.pipe(
      map((tasks) => tasks.find((task) => task.id === id)),
    );
  }

  addTask(task: Task): void {
    const tasks = this.tasksSubject.value;

    this.tasksSubject.next([...tasks, task]);
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.tasksSubject.value.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );

    this.tasksSubject.next(tasks);
  }

  deleteTask(id: number): void {
    const tasks = this.tasksSubject.value.filter((task) => task.id !== id);

    this.tasksSubject.next(tasks);
  }
}
