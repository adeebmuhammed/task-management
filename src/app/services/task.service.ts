import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Task } from '../interfaces/task';
import { tasksUrl } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly tasksUrl = `${tasksUrl}`;

  constructor(private http: HttpClient) {}
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  getTaskById(id: number): Observable<Task | undefined> {
    return this.http
      .get<Task[]>(this.tasksUrl)
      .pipe(map((tasks) => tasks.find((task) => task.id === id)));
  }
}
