import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { login, register } from '../services/authService.js';
// what's the initial state
const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    login: {
        status: 'idle',
        error: null,
    },
    registration: {
        status: 'idle',
        error: null,
    },
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await login(credentials);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
    
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const data = await register(userData);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }                                                                                               
);

export const logoutUser = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};

//saveUser
export const saveUser = (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.login.status = 'idle';
            state.login.error = null;
            state.registration.status = 'idle';
            state.registration.error = null;
            logoutUser();
        },
        clearAuthState: (state) => {
            state.login.status = 'idle';
            state.login.error = null;
            state.registration.status = 'idle';
            state.registration.error = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.login.status = 'loading';
                state.login.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.login.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.login.status = 'failed';
                state.login.error = action.payload;
            })
            .addCase(registerUser.pending, (state) => {
                state.registration.status = 'loading';
                state.registration.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registration.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registration.status = 'failed';
                state.registration.error = action.payload;
            });
    }
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;