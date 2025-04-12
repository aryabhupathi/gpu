import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Interfaces
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  forumId: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchCommentsByForumId = createAsyncThunk(
  'comment/fetchByForumId',
  async (forumId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/comments?forumId=${forumId}`);
      return response.data; // Should include user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/add',
  async (
    { forumId, content }: { forumId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        '/api/comments',
        { forumId, content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/delete',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, { withCredentials: true });
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete comment');
    }
  }
);

export const fetchUserComments = createAsyncThunk(
  'forum/fetchUserComments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/comments/user', { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user forums');
    }
  }
);

// Slice
const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByForumId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByForumId.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchCommentsByForumId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload); // add new comment at top
      })
      .addCase(fetchUserComments.fulfilled, (state, action) => {
              state.comments = action.payload;
            })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
