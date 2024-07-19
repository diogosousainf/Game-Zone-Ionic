import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private apiUrl = 'http://localhost:3000/gamesList';

  async getGames(params?: any) {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axios.get(`${this.apiUrl}?${queryParams}`);
    return response.data;
  }

  async getGameById(id: string) {
    const response = await axios.get(`${this.apiUrl}/${id}`);
    return response.data;
  }
}
