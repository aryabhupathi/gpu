import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Comment } from '@/types';

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

export const fetchCommentsByForumId = createAsyncThunk(
  'comment/fetchByForumId',
  async (forumId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/forums/${forumId}/comments`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/add',
  async ({ forumId, content }: { forumId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/comments', { forumId, content });
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
      await axios.delete(`/api/comments/${commentId}`);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete comment');
    }
  }
);

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
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;