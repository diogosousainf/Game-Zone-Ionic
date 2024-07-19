// src/app/login/login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from "../services/auth.service";
import { StorageModule } from '../storage.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonInput, IonButton, RouterLink, StorageModule]
})
export class LoginPage  {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/profile']); // Redirecionar para a página de perfil após login bem-sucedido
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Login failed',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
