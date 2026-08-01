import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import authReducer from '../../reducers/authSlice';
import threadReducer from '../../reducers/threadListSlice';
import currentThreadReducer from '../../reducers/currentThreadSlice';
import commentReducer from '../../reducers/commentSlice';
import subredditReducer from '../../reducers/subredditSlice';
import themeReducer from '../../reducers/themeSlice';
import { mockUser } from '../mocks/data.js';

export function renderWithProviders(ui, { route = '/', preloadedState = {} } = {}) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      threads: threadReducer,
      currentThread: currentThreadReducer,
      comments: commentReducer,
      subreddits: subredditReducer,
      theme: themeReducer,
    },
    preloadedState: {
      auth: {
        user: mockUser,
        token: 'test-jwt-token',
        login: { status: 'idle', error: null },
        registration: { status: 'idle', error: null },
        error: null,
      },
      ...preloadedState,
    },
  });

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { ...render(ui, { wrapper: Wrapper }), store };
}
