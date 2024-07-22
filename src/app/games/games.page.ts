import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import axios from 'axios';
import {Router, RouterLink} from "@angular/router";
import {GameService} from "../services/game.service";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";



@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterLink, FormsModule]
})
export class GamesPage implements OnInit {
  games: any[] = [];
  searchQuery: string = '';
  platformFilter: string = '';
  genreFilter: string = '';
  sortField: string = 'title';
  sortOrder: string = 'asc';

  platforms: any[] = [
    { id: '4e6c', name: 'Web Browser' },
    { id: 'ef6a', name: 'PC (Windows)' },
    { id: 'ea9d', name: 'Playstation 5' }
  ];

  genres: any[] = [
    { id: '8dbf', name: 'MMORPG' },
    { id: '599d', name: 'Shooter' },
    { id: 'f828', name: 'Strategy' },
    { id: '99fe', name: 'Action RPG' },
    { id: '9bf2', name: 'Battle Royale' },
    { id: 'fe4a', name: 'ARPG' },
    { id: 'f04d', name: 'MMOARPG' },
    { id: 'f93a', name: 'Moba' },
    { id: '6554', name: 'Card Games' }
  ];

  constructor(
    private gameService: GameService,
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    await this.loadGames();
  }

  async loadGames() {
    const params: any = {
      _sort: this.sortField,
      _order: this.sortOrder
    };
    if (this.searchQuery) {
      params.title = this.searchQuery;
    }
    if (this.platformFilter) {
      params.platform = this.platformFilter;
    }
    if (this.genreFilter) {
      params.genre = this.genreFilter;
    }
    this.games = await this.gameService.getGames(params);
  }

  async onFilterChange() {
    await this.loadGames();
  }

  viewDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  goBackToProfile() {
    this.router.navigate(['/profile']);
  }
}
