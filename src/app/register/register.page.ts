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
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonInput, IonButton]
})
export class RegisterPage  {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      const toast = await this.toastController.create({
        message: 'Passwords do not match',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const user = {
      name: this.name,
      email: this.email,
      password: this.password,
      avatar: null
    };

    try {
      const newUser = await this.authService.register(user);
      this.router.navigate(['/games']);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Registration failed',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
