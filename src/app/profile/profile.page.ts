import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PersonalizedListService } from '../services/personalized-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { IonicModule, ToastController } from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, NgOptimizedImage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfilePage implements OnInit {
  user: any = {};
  lists: any = {
    playLater: [],
    currentlyPlaying: [],
    played: [],
    completed: []
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private personalizedListService: PersonalizedListService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    await this.loadData();
  }

  ionViewWillEnter() {
    this.loadData();
  }

  async loadData() {
    this.user = await this.authService.getUser();
    await this.loadLists();
  }

  async loadLists() {
    this.lists.playLater = await this.personalizedListService.getList('PlayLater');
    this.lists.currentlyPlaying = await this.personalizedListService.getList('CurrentlyPlaying');
    this.lists.played = await this.personalizedListService.getList('Played');
    this.lists.completed = await this.personalizedListService.getList('Completed');
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }

  async updateProfile() {
    try {
      await this.authService.updateUser(this.user);
      this.presentToast('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
      this.presentToast('Failed to update profile', 'danger');
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
    this.presentToast('Logged out successfully');
  }

  async removeAvatar() {
    this.user.avatar = null;
    await this.authService.updateUser(this.user);
    this.presentToast('Avatar removed successfully');
  }

  async removeFromList(gameId: string, listName: string) {
    await this.personalizedListService.removeGameFromList(gameId, listName);
    this.loadLists();
    this.presentToast(`Removed from ${listName} list`);
  }

  viewDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  goToGames() {
    this.router.navigate(['/games']);
  }

  onAvatarUrlChange() {
    // This function will trigger change detection and update the avatar image in the template
  }
}
