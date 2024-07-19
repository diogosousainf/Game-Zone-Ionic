import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import axios from 'axios';
import {RouterLink} from "@angular/router";



@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink]
})
export class GamesPage {
  games: any[] = [];

  constructor() {
    this.loadGames();
  }

  async loadGames() {
    try {
      const response = await axios.get('http://localhost:3000/gamesList');
      this.games = response.data;
    } catch (error) {
      console.error('Error loading games', error);
    }
  }
}
