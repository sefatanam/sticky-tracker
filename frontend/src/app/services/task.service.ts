import { WebrequestService } from './webrequest.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webRequest: WebrequestService) { }

  createList(title: string) {
    return this.webRequest.post('lists', { title });
  }

  getLists() {
    return this.webRequest.get('lists');
  }

  getTasks(listId: string) {
    return this.webRequest.get(`lists/${listId}/tasks`);
  }
}
