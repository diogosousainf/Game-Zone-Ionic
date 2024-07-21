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
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    await this.ensureStorageIsReady();

    const response = await axios.get(`http://localhost:3000/users?email=${email}&password=${password}`);
    if (response.data.length > 0) {
      await this._storage?.set('user', response.data[0]);
      return response.data[0];
    } else {
      throw new Error('Invalid credentials');
    }
  }

  async register(user: any) {
    await this.ensureStorageIsReady();

    const existingUserResponse = await axios.get(`http://localhost:3000/users?email=${user.email}`);
    if (existingUserResponse.data.length > 0) {
      throw new Error('Email already in use');
    }

    const response = await axios.post('http://localhost:3000/users', user);
    if (response.status === 201) {
      await this._storage?.set('user', response.data);
      return response.data;
    } else {
      throw new Error('Registration failed');
    }
  }

  async getUser() {
    await this.ensureStorageIsReady();
    return await this._storage?.get('user');
  }

  async updateUser(user: any) {
    await this.ensureStorageIsReady();

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
    await this.ensureStorageIsReady();
    await this._storage?.remove('user');
  }

  async isLoggedIn() {
    await this.ensureStorageIsReady();
    const user = await this._storage?.get('user');
    return !!user;
  }

  private async ensureStorageIsReady() {
    if (!this._storage) {
      await this.init();
    }
  }
}
