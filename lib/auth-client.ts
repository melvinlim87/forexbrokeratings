import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { login as loginAction, logout as logoutAction } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const loading = false; // You can enhance this with a loading state if needed

  // Hydrate user from /api/me on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          dispatch(loginAction({ email: data.user.email })); // Add more fields as needed
        } else {
          dispatch(logoutAction());
        }
      } catch {
        dispatch(logoutAction());
      }
    };
    checkSession();
    // eslint-disable-next-line
  }, [dispatch]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(loginAction({ email: data.user.email })); // Add more fields as needed
        return { success: true };
      } else {
        const data = await res.json();
        dispatch(logoutAction());
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (e: any) {
      dispatch(logoutAction());
      return { success: false, error: e.message };
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' });
    dispatch(logoutAction());
  }, [dispatch]);

  return { user, loading, login, logout };
}
