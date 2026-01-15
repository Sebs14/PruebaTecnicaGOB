'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';
import { tokenStorage } from '@/lib/api/client';
import type { LoginCredentials } from '@/types';

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: clearAuth,
  } = useAuthStore();

  // Verificar sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      // Si no hay token guardado, no intentar verificar
      const token = tokenStorage.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        tokenStorage.removeToken();
        setUser(null);
      }
    };

    if (isLoading) {
      checkAuth();
    }
  }, [isLoading, setUser]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setLoading(true);
      try {
        const response = await authService.login(credentials);
        // Guardar el token en localStorage
        tokenStorage.setToken(response.accessToken);
        setUser(response.user);
        router.push('/');
        return { success: true };
      } catch (error) {
        setLoading(false);
        const message =
          error instanceof Error ? error.message : 'Error al iniciar sesión';
        return { success: false, error: message };
      }
    },
    [router, setUser, setLoading]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignorar error de logout en el servidor
    } finally {
      // Limpiar token de localStorage
      tokenStorage.removeToken();
      clearAuth();
      router.push('/login');
    }
  }, [router, clearAuth]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
