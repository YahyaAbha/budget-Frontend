import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID); // 🌟 Platform ki ID li
  const currentUrl = state.url;

  // 🌟 Check karein ke kya code BROWSER par chal raha hai?
  if (isPlatformBrowser(platformId)) {
    const user = localStorage.getItem('user');

    // Case 1: Agar user login HAI 🟢
    if (user) {
      if (currentUrl === '/login' || currentUrl === '/signup') {
        router.navigate(['/home']);
        return false;
      }
      return true;
    }

    // Case 2: Agar user login NAHI hai 🔴
    else {
      if (currentUrl === '/login' || currentUrl === '/signup') {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }
  }

  // Agar code server par chal raha hai (SSR), to abhi rasta block mat karo, browser par aane do
  return true;
};
