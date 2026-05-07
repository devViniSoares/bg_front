import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const usuario = localStorage.getItem('usuarioSessao');

    if (usuario) {
      return true;
    }
  }

  if (isPlatformBrowser(platformId)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};