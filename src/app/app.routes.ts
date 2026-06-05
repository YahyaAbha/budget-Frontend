import { Routes } from '@angular/router';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  // 🌟 Yeh naya default route add karein
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./Component/Form/login/login').then((m) => m.Login),
    canActivate: [authGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./Component/Pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    loadComponent: () => import('./Component/Form/sign-up/sign-up').then((m) => m.SignUp),
    canActivate: [authGuard],
  },
  // 🌟 Agar user koi galat URL likh de, to use login par bhej do (Wildcard Route)
  {
    path: '**',
    redirectTo: 'login',
  },
];
