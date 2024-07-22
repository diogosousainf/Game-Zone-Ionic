import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton, IonButtons,
  IonCard, IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonCheckbox,
  IonContent,
  IonHeader, IonItem, IonLabel, IonList, IonListHeader,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular/standalone';
import {GameService} from "../services/game.service";
import {ActivatedRoute, Router} from "@angular/router";
import { IonicModule } from '@ionic/angular';
import {PersonalizedListService} from "../services/personalized-list.service";

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonList, IonListHeader, IonLabel, IonItem, IonCheckbox, IonButtons]
})
export class GameDetailsPage implements OnInit {
  game: any;
  lists = {
    playLater: false,
    currentlyPlaying: false,
    played: false,
    completed: false
  };

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private personalizedListService: PersonalizedListService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.game = await this.gameService.getGameById(gameId);
    } else {
      // Handle case where gameId is null, e.g., navigate back to the games list
      this.router.navigate(['/games']);
    }
  }

  async addToLists() {
    const gameId = this.game.id; // Assumindo que o ID do jogo está na propriedade `id`
    if (this.lists.playLater) {
      await this.personalizedListService.addGameToList(gameId, 'PlayLater');
    }
    if (this.lists.currentlyPlaying) {
      await this.personalizedListService.addGameToList(gameId, 'CurrentlyPlaying');
    }
    if (this.lists.played) {
      await this.personalizedListService.addGameToList(gameId, 'Played');
    }
    if (this.lists.completed) {
      await this.personalizedListService.addGameToList(gameId, 'Completed');
    }
    this.showToast('Game added to selected lists');
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  goBackToGames() {
    this.router.navigate(['/games']);
  }
}
