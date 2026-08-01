import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchCommentsForThread,
  postComment,
  upvoteComment,
  downvoteComment,
} from '../services/commentService.js';
import { handleApiError } from '../utils/handleApiError.js';

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (threadId, { rejectWithValue }) => {
    try {
      return await fetchCommentsForThread(threadId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      return await postComment({ threadId, content });
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const upvoteCommentThunk = createAsyncThunk(
  'comments/upvoteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      return await upvoteComment(commentId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const downvoteCommentThunk = createAsyncThunk(
  'comments/downvoteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      return await downvoteComment(commentId);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // addComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // upvoteCommentThunk
      .addCase(upvoteCommentThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(upvoteCommentThunk.fulfilled, (state, action) => {
        const index = state.comments.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(upvoteCommentThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      // downvoteCommentThunk
      .addCase(downvoteCommentThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(downvoteCommentThunk.fulfilled, (state, action) => {
        const index = state.comments.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) state.comments[index] = action.payload;
      })
      .addCase(downvoteCommentThunk.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
