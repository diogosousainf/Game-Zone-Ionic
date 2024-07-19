import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProfilePage implements OnInit {
  user: any = {
    id: '',
    name: '',
    email: '',
    password: '',
    avatar: null
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const user = await this.authService.getUser();
    if (user) {
      this.user = user;
    } else {
      // Se não houver usuário logado, redireciona para a página de login
      this.router.navigate(['/login']);
    }
  }

  async updateProfile() {
    try {
      await this.authService.updateUser(this.user);
      const toast = await this.toastController.create({
        message: 'Profile updated successfully',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Failed to update profile',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }

  async removeAvatar() {
    this.user.avatar = null;
    await this.updateProfile();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  goBackToGames() {
    this.router.navigate(['/games']);
  }
}
