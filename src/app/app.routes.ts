import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'games',
    loadComponent: () => import('./games/games.page').then(m => m.GamesPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'game-details/:id',
    loadComponent: () => import('./game-details/game-details.page').then(m => m.GameDetailsPage)
  },
  {
    path: 'user-lists',
    loadComponent: () => import('./pages/user-lists/user-lists.page').then(m => m.UserListsPage)
  },
  {
    path: 'user-lists',
    loadComponent: () => import('./pages/user-lists/user-lists.page').then( m => m.UserListsPage)
  },
];
