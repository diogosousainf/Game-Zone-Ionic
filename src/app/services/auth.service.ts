import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;
  private apiUrl = 'http://localhost:3000';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async login(email: string, password: string) {
    try {
      const response = await axios.get(`${this.apiUrl}/users?email=${email}&password=${password}`);
      if (response.data.length > 0) {
        await this._storage?.set('user', response.data[0]);
        return response.data[0];
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error logging in';
      throw new Error(message);
    }
  }

  async register(user: any) {
    try {
      const existingUserResponse = await axios.get(`${this.apiUrl}/users?email=${user.email}`);
      if (existingUserResponse.data.length > 0) {
        throw new Error('Email already in use');
      }

      const response = await axios.post(`${this.apiUrl}/users`, user);
      if (response.status === 201) {
        await this._storage?.set('user', response.data);
        return response.data;
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error registering';
      throw new Error(message);
    }
  }

  async getUser() {
    return await this._storage?.get('user');
  }

  async updateUser(user: any) {
    try {
      if (!user.id) {
        throw new Error('User ID is required to update profile');
      }
      const response = await axios.put(`${this.apiUrl}/users/${user.id}`, user);
      if (response.status === 200) {
        await this._storage?.set('user', response.data);
        return response.data;
      } else {
        throw new Error('Update failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error updating profile';
      throw new Error(message);
    }
  }

  async logout() {
    await this._storage?.remove('user');
  }
}
