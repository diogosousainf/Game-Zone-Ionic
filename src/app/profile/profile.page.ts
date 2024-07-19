import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PersonalizedListService } from '../services/personalized-list.service';
import { FormsModule } from '@angular/forms';
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular"; // Certifique-se de importar FormsModule


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule], // Adicione FormsModule
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // AdiModule
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
    private personalizedListService: PersonalizedListService
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = await this.authService.getUser();
    this.loadLists();
  }

  async loadLists() {
    this.lists.playLater = await this.personalizedListService.getList('PlayLater');
    this.lists.currentlyPlaying = await this.personalizedListService.getList('CurrentlyPlaying');
    this.lists.played = await this.personalizedListService.getList('Played');
    this.lists.completed = await this.personalizedListService.getList('Completed');
  }

  async updateProfile() {
    try {
      await this.authService.updateUser(this.user);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile', error);
      alert('Failed to update profile');
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  async removeAvatar() {
    this.user.avatar = null;
    await this.authService.updateUser(this.user);
  }

  async removeFromList(gameId: string, listName: string) {
    await this.personalizedListService.removeGameFromList(gameId, listName);
    this.loadLists();
  }

  viewDetails(gameId: string) {
    this.router.navigate(['/game-details', gameId]);
  }

  goToGames() {
    this.router.navigate(['/games']);
  }
}
