import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
}
