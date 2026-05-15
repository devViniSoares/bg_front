import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const raw = localStorage.getItem('usuarioSessao');
    if (raw) {
      try {
        const usuario = JSON.parse(raw);
        if (usuario.tipo === 'ADMIN') return true;
      } catch {}
    }
    alert('Acesso negado! Área restrita apenas para administradores.');
    router.navigate(['/login']);
    return false;
  }

  return true;
};
