import { Component, OnInit } from '@angular/core';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
  this.taskService.getTasks().subscribe(tasks => {
    const prioridadOrden = { 'alta': 0, 'media': 1, 'baja': 2 };
    this.tasks = tasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return Number(a.completed) - Number(b.completed);
      }
      const prioridadA = prioridadOrden[a.prioridad as keyof typeof prioridadOrden] ?? prioridadOrden['media'];
      const prioridadB = prioridadOrden[b.prioridad as keyof typeof prioridadOrden] ?? prioridadOrden['media'];
      return prioridadA - prioridadB;
    });
  });
}

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    this.taskService.addTask(this.newTaskTitle).subscribe(task => {
      this.tasks.push(task);
      this.newTaskTitle = '';
    });
  }

  toggleTask(task: Task) {
    this.taskService.toggleTask(task._id!).subscribe(updatedTask => {
      task.completed = updatedTask.completed;
    });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task._id!).subscribe(() => {
      this.tasks = this.tasks.filter(t => t._id !== task._id);
    });
  }

  logout() {
    this.authService.logout();
  }
}
