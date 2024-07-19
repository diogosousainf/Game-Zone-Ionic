import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { UserGameService } from '../services/user-game.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.page.html',
  styleUrls: ['./game-details.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ]
})
export class GameDetailsPage implements OnInit {
  game: any;
  selectedList: string = '';
  userId: string = '';

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private userGameService: UserGameService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const gameId = this.route.snapshot.paramMap.get('id');
    if (gameId) {
      this.game = await this.gameService.getGameById(gameId);
    } else {
      this.router.navigate(['/games']);
    }

    const user = await this.authService.getUser();
    this.userId = user.id;
  }

  async addToList() {
    try {
      await this.userGameService.addToList(this.selectedList, this.userId, this.game.id);
      this.presentToast('Game added to list', 'success');
    } catch (error) {
      this.presentToast('Failed to add game to list', 'danger');
    }
  }

  async removeFromList() {
    try {
      await this.userGameService.removeFromList(this.selectedList, this.userId, this.game.id);
      this.presentToast('Game removed from list', 'success');
    } catch (error) {
      this.presentToast('Failed to remove game from list', 'danger');
    }
  }

  async moveToList() {
    try {
      await this.removeFromList();
      await this.addToList();
      this.presentToast('Game moved to another list', 'success');
    } catch (error) {
      this.presentToast('Failed to move game to another list', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    toast.present();
  }

  goToGames() {
    this.router.navigate(['/games']);
  }
}
