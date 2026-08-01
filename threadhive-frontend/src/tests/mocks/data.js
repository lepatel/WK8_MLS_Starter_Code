export const mockUser = {
  _id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
};

export const mockSubreddit = {
  _id: 'subreddit-1',
  name: 'reactjs',
  description: 'A subreddit for React discussion',
};

export const mockThread = {
  _id: 'thread-1',
  title: 'Test Thread Title',
  content: 'Test thread content here.',
  author: mockUser,
  subreddit: mockSubreddit,
  upvotes: 5,
  downvotes: 2,
  voteCount: 3,
  upvotedBy: [],
  downvotedBy: [],
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const mockThread2 = {
  _id: 'thread-2',
  title: 'Second Thread Title',
  content: 'Second thread content.',
  author: mockUser,
  subreddit: mockSubreddit,
  upvotes: 1,
  downvotes: 0,
  voteCount: 1,
  upvotedBy: [],
  downvotedBy: [],
  createdAt: '2024-01-02T00:00:00.000Z',
};

export const mockComment = {
  _id: 'comment-1',
  thread: 'thread-1',
  user: mockUser,
  content: 'This is a test comment.',
  upvotedBy: [],
  downvotedBy: [],
  voteCount: 0,
  createdAt: '2024-01-01T01:00:00.000Z',
};

export const mockAuthResponse = {
  token: 'test-jwt-token',
  user: mockUser,
};
