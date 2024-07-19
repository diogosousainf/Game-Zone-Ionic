import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageModule } from 'src/app/storage.module';
import { UserGameService } from 'src/app/services/user-game.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.page.html',
  styleUrls: ['./user-lists.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, StorageModule]
})
export class UserListsPage implements OnInit {
  segmentValue: string = 'playLater';
  gameLists: any = {
    playLater: [],
    currentlyPlaying: [],
    played: [],
    completed: []
  };
  userId: string = '';

  constructor(
    private userGameService: UserGameService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    const user = await this.authService.getUser();
    this.userId = user.id;
    await this.loadLists();
  }

  async loadLists() {
    this.gameLists.playLater = await this.userGameService.getList('playLater', this.userId);
    this.gameLists.currentlyPlaying = await this.userGameService.getList('currentlyPlaying', this.userId);
    this.gameLists.played = await this.userGameService.getList('played', this.userId);
    this.gameLists.completed = await this.userGameService.getList('completed', this.userId);
  }

  segmentChanged(event: any) {
    this.segmentValue = event.detail.value;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
