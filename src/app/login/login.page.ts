import { Component, OnInit } from '@angular/core';
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
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    RouterLink
  ]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.router.navigate(['/profile']);
    }
  }

  async login() {
    if (!this.email || !this.password) {
      const toast = await this.toastController.create({
        message: 'Email and password are required',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

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
