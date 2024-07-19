import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:3000';

  async getGames(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(`${this.apiUrl}/gamesList?${queryParams}`);
    return response.data;
  }

  async getGameById(id: string) {
    const response = await axios.get(`${this.apiUrl}/gamesList/${id}`);
    return response.data;
  }

  async getUserLists(userId: string) {
    const response = await axios.get(`${this.apiUrl}/users?id=${userId}`);
    return response.data[0];
  }

  async addGameToList(userId: string, listName: string, gameId: string) {
    const listUrl = this.getListUrl(listName);
    const response = await axios.post(`${this.apiUrl}/${listUrl}`, {
      userId,
      gameId,
      createDate: new Date().toISOString()
    });
    return response.data;
  }

  async removeGameFromList(userId: string, listName: string, gameId: string) {
    const listUrl = this.getListUrl(listName);
    const entries = await axios.get(`${this.apiUrl}/${listUrl}?userId=${userId}&gameId=${gameId}`);
    const entryId = entries.data[0].id;
    const response = await axios.delete(`${this.apiUrl}/${listUrl}/${entryId}`);
    return response.data;
  }

  async moveGameBetweenLists(userId: string, fromList: string, toList: string, gameId: string) {
    await this.removeGameFromList(userId, fromList, gameId);
    return await this.addGameToList(userId, toList, gameId);
  }

  private getListUrl(listName: string): string {
    switch (listName) {
      case 'playLater': return 'usersListPlayLater';
      case 'currentlyPlaying': return 'usersListCurrentlyPlaying';
      case 'played': return 'usersListPlayed';
      case 'completed': return 'usersListCompleted';
      default: throw new Error('Invalid list name');
    }
  }
}
