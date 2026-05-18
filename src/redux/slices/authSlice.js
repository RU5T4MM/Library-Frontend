import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

const token = localStorage.getItem('token') || null;
const _rawUser = localStorage.getItem('user');
const user = _rawUser && _rawUser !== 'undefined' ? JSON.parse(_rawUser) : null;

const initialState = {
    user: user,
    token: token,
    isAuthenticated: !!token,
    loading: false,
    verifying: !!token,
    accountDeleted: false,
    error: null,
};

// Verify token with backend on app load
export const verifyAuth = createAsyncThunk('auth/verifyAuth', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/auth/me');
        return res.data.data;
    } catch (err) {
        return rejectWithValue('Invalid session');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.accountDeleted = false;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.verifying = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.verifying = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setAccountDeleted: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.verifying = false;
            state.accountDeleted = true;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyAuth.fulfilled, (state, action) => {
                state.verifying = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(verifyAuth.rejected, (state) => {
                state.verifying = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });
    },

});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, setAccountDeleted } = authSlice.actions;
export default authSlice.reducer;
