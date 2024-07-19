import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async login(email: string, password: string) {
    const response = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
    if (response.data.length > 0) {
      await this._storage?.set('user', response.data[0]);
      return response.data[0];
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async register(user: any) {
    // Verificar se o e-mail já está em uso
    const existingUserResponse = await axios.get(`http://localhost:3000/users?email=${user.email}`);
    if (existingUserResponse.data.length > 0) {
      throw new Error('Email already in use');
    }

    // Criar o novo usuário se o e-mail não estiver em uso
    const response = await axios.post('http://localhost:3000/users', user);
    if (response.status === 201) {
      await this._storage?.set('user', response.data);
      return response.data;
    } else {
      throw new Error('Registration failed');
    }
  }

  async getUser() {
    return await this._storage?.get('user');
  }

  async updateUser(user: any) {
    if (!user.id) {
      throw new Error('User ID is required to update profile');
    }
    const response = await axios.put(`http://localhost:3000/users/${user.id}`, user);
    if (response.status === 200) {
      await this._storage?.set('user', response.data);
      return response.data;
    } else {
      throw new Error('Update failed');
    }
  }

  async logout() {
    await this._storage?.remove('user');
  }
}
