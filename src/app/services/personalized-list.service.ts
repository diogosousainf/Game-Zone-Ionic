import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalizedListService {
  constructor(private authService: AuthService) {}

  private async getGameDetails(gameId: string) {
    const response = await axios.get(`http://localhost:3000/gamesList/${gameId}`);
    return response.data;
  }

  private async getListWithDetails(listName: string) {
    const user = await this.authService.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const response = await axios.get(`http://localhost:3000/usersList${listName}?userId=${user.id}`);
    const list = response.data;

    // Fetch game details for each game in the list
    const detailedList = await Promise.all(list.map(async (item: any) => {
      const gameDetails = await this.getGameDetails(item.gameId);
      return {
        ...item,
        ...gameDetails
      };
    }));

    return detailedList;
  }

  async getList(listName: string) {
    return await this.getListWithDetails(listName);
  }

  async addGameToList(gameId: string, listName: string) {
    const user = await this.authService.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const response = await axios.post(`http://localhost:3000/usersList${listName}`, {
      userId: user.id,
      gameId,
      createDate: new Date().toISOString()
    });
    return response.data;
  }

  async removeGameFromList(gameId: string, listName: string) {
    const user = await this.authService.getUser();
    if (!user) {
      throw new Error('User not logged in');
    }

    const list = await this.getListWithDetails(listName);
    const listItem = list.find((item: any) => item.gameId === gameId);
    if (listItem) {
      await axios.delete(`http://localhost:3000/usersList${listName}/${listItem.id}`);
    }
  }

  async isGameInList(gameId: string, listName: string) {
    const list = await this.getListWithDetails(listName);
    return list.some((item: any) => item.gameId === gameId);
  }
}
