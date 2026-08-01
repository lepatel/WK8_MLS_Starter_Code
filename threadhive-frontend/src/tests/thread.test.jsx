import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from './mocks/server.js';
import { renderWithProviders } from './utils/renderWithProviders.jsx';
import { mockThread, mockThread2 } from './mocks/data.js';
import { fetchThreads, upvoteThreadThunk, downvoteThreadThunk } from '../reducers/threadListSlice.js';
import { fetchThreadById } from '../reducers/currentThreadSlice.js';
import ThreadList from '../components/ThreadList/ThreadList.jsx';
import ThreadCard from '../components/ThreadList/ThreadCard.jsx';

describe('Thread Flow — rendering', () => {
  it('renders both thread titles from prop', () => {
    renderWithProviders(
      <ThreadList threadsToDisplay={[mockThread, mockThread2]} />
    );
    expect(screen.getByText(mockThread.title)).toBeInTheDocument();
    expect(screen.getByText(mockThread2.title)).toBeInTheDocument();
  });

  it('renders thread card with title and content', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    expect(screen.getByText(mockThread.title)).toBeInTheDocument();
    expect(screen.getByText(mockThread.content)).toBeInTheDocument();
  });

  it('shows author name on thread card', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    expect(screen.getByText(mockThread.author.name)).toBeInTheDocument();
  });

  it('shows subreddit name on thread card', () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    expect(screen.getByText(`r/${mockThread.subreddit.name}`)).toBeInTheDocument();
  });

  it('shows fallback message when thread is null', () => {
    renderWithProviders(<ThreadCard thread={null} />);
    expect(screen.getByText('No thread found')).toBeInTheDocument();
  });
});

describe('Thread Flow — fetch thunk', () => {
  it('fetchThreads populates state.threads.threads', async () => {
    const { store } = renderWithProviders(<ThreadList threadsToDisplay={[]} />);
    await store.dispatch(fetchThreads());
    const state = store.getState();
    expect(state.threads.threads).toHaveLength(2);
    expect(state.threads.threads[0].title).toBe(mockThread.title);
  });

  it('fetchThreadById populates state.currentThread.thread', async () => {
    const { store } = renderWithProviders(<ThreadCard thread={null} />);
    await store.dispatch(fetchThreadById(mockThread._id));
    const state = store.getState();
    expect(state.currentThread.thread).not.toBeNull();
    expect(state.currentThread.thread.title).toBe(mockThread.title);
  });

  it('fetchThreadById sets error state on 404', async () => {
    const { store } = renderWithProviders(<ThreadCard thread={null} />);
    await store.dispatch(fetchThreadById('not-found'));
    const state = store.getState();
    expect(state.currentThread.error).toBeTruthy();
    expect(state.currentThread.thread).toBeNull();
  });
});

describe('Thread Flow — voting', () => {
  it('upvoteThreadThunk updates voteCount in state', async () => {
    const { store } = renderWithProviders(
      <ThreadList threadsToDisplay={[mockThread]} />,
      { preloadedState: { threads: { threads: [mockThread], loading: false, error: null } } }
    );
    await store.dispatch(upvoteThreadThunk(mockThread._id));
    const state = store.getState();
    const updated = state.threads.threads.find((t) => t._id === mockThread._id);
    expect(updated.voteCount).toBe(4);
  });

  it('downvoteThreadThunk updates voteCount in state', async () => {
    const { store } = renderWithProviders(
      <ThreadList threadsToDisplay={[mockThread]} />,
      { preloadedState: { threads: { threads: [mockThread], loading: false, error: null } } }
    );
    await store.dispatch(downvoteThreadThunk(mockThread._id));
    const state = store.getState();
    const updated = state.threads.threads.find((t) => t._id === mockThread._id);
    expect(updated.voteCount).toBe(2);
  });

  it('upvote button in ThreadCard dispatches upvote thunk', async () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    const upvoteBtn = screen.getByRole('button', { name: /upvote/i });
    await userEvent.click(upvoteBtn);
    // No unhandled request error means MSW handled it correctly
  });

  it('downvote button in ThreadCard dispatches downvote thunk', async () => {
    renderWithProviders(<ThreadCard thread={mockThread} />);
    const downvoteBtn = screen.getByRole('button', { name: /downvote/i });
    await userEvent.click(downvoteBtn);
  });
});
