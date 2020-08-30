import { WebrequestService } from './webrequest.service';
import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequest: WebrequestService) { }

  getLists() {
    return this.webRequest.get('lists');
  }
  createList(title: string) {
    return this.webRequest.post('lists', { title });
  }

  getTasks(listId: string) {
    return this.webRequest.get(`lists/${listId}/tasks`);
  }
  createTask(listId: string, title: string, ) {
    return this.webRequest.post(`lists/${listId}/tasks`, { title });
  }

  complete(task: Task) {
    return this.webRequest.patch(`lists/${task._listId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }
}
