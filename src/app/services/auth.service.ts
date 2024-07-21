import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _storage: Storage | null = null;
  private _user: any = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
    this._user = await this.getUser();
  }

  async login(email: string, password: string) {
    const response = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
    if (response.data.length > 0) {
      this._user = response.data[0];
      await this._storage?.set('user', this._user);
      return this._user;
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async register(user: any) {
    const existingUserResponse = await axios.get(`http://localhost:3000/users?email=${user.email}`);
    if (existingUserResponse.data.length > 0) {
      throw new Error('Email already in use');
    }

    const response = await axios.post('http://localhost:3000/users', user);
    if (response.status === 201) {
      this._user = response.data;
      await this._storage?.set('user', this._user);
      return this._user;
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
      this._user = response.data;
      await this._storage?.set('user', this._user);
      return this._user;
    } else {
      throw new Error('Update failed');
    }
  }

  async logout() {
    this._user = null;
    await this._storage?.remove('user');
  }

  async isLoggedIn() {
    return !!this._user;
  }
}
