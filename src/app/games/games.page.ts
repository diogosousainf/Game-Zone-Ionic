import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { StorageModule } from '../storage.module';

@Component({
  selector: 'app-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, StorageModule]
})
export class GamesPage implements OnInit {
  searchQuery: string = '';
  platformFilter: string = '';
  genreFilter: string = '';
  sortField: string = 'title';
  sortOrder: string = 'asc';
  games: any[] = [];
  platforms: any[] = []; // Preencher com os dados reais
  genres: any[] = []; // Preencher com os dados reais

  constructor(
    private gameService: GameService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGames();
  }

  loadGames() {
    // Carregar os jogos da API ou serviço
    this.gameService.getGames().then(data => {
      this.games = data;
      this.onFilterChange();
    });
  }

  onFilterChange() {
    // Filtrar e ordenar os jogos com base nos critérios de busca e filtro
    let filteredGames = this.games.filter(game =>
      game.title.toLowerCase().includes(this.searchQuery.toLowerCase()) &&
      (this.platformFilter ? game.platform.includes(this.platformFilter) : true) &&
      (this.genreFilter ? game.genre.includes(this.genreFilter) : true)
    );

    if (this.sortField && this.sortOrder) {
      filteredGames = filteredGames.sort((a, b) => {
        const fieldA = a[this.sortField].toLowerCase();
        const fieldB = b[this.sortField].toLowerCase();
        if (this.sortOrder === 'asc') {
          return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
        } else {
          return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
        }
      });
    }

    this.games = filteredGames;
  }

  viewDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
