import { Users } from '@/lib/supabase';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<Users>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
    setUser(state, action: PayloadAction<Users>) {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
