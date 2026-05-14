import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const emailLogado = localStorage.getItem('emailUsuario');
    if (emailLogado === 'admin@bigode.com') {
      return true; 
    } else {
      alert('Acesso negado! Área restrita apenas para a diretoria.');
      router.navigate(['/login']); 
      return false; 
    }
  }

  return true; 
};