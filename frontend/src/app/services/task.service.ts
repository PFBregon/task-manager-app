import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {HttpHeaders } from '@angular/common/http';

export interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  categoria?: string;
  prioridad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/tasks';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title }, { headers: this.getAuthHeaders() });
  }

  toggleTask(id: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, {}, { headers: this.getAuthHeaders() });
  }

  updateTask(id: string, data: { completed: boolean }): Observable<Task> {
  return this.http.put<Task>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
}


  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
