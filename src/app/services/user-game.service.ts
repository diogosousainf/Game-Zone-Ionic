import { Injectable } from '@angular/core';
import axios from 'axios';
import { UserGameListItem } from './user-game-list-item.interface';

@Injectable({
  providedIn: 'root'
})
export class UserGameService {
  private apiUrl = 'http://localhost:3000/gamesList';

  async getList(listName: string, userId: string): Promise<UserGameListItem[]> {
    const response = await axios.get(`${this.apiUrl}?listName=${listName}&userId=${userId}`);
    return response.data;
  }

  async addToList(listName: string, userId: string, gameId: string) {
    const newItem: UserGameListItem = { id: this.generateId(), userId, gameId, listName, createDate: new Date().toISOString() };
    await axios.post(this.apiUrl, newItem);
  }

  async removeFromList(listName: string, userId: string, gameId: string) {
    const response = await axios.get(`${this.apiUrl}?listName=${listName}&userId=${userId}&gameId=${gameId}`);
    const item = response.data[0];
    if (item) {
      await axios.delete(`${this.apiUrl}/${item.id}`);
    }
  }

  async isGameInList(listName: string, userId: string, gameId: string): Promise<boolean> {
    const response = await axios.get(`${this.apiUrl}?listName=${listName}&userId=${userId}&gameId=${gameId}`);
    return response.data.length > 0;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
