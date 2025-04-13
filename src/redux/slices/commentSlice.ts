import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
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
export const fetchCommentsByForumId = createAsyncThunk(
  "comment/fetchByForumId",
  async (forumId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/comments?forumId=${forumId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch comments"
      );
    }
  }
);
export const addComment = createAsyncThunk(
  "comment/add",
  async (
    { forumId, content }: { forumId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "/api/comments",
        { forumId, content },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to add comment"
      );
    }
  }
);
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (commentId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        withCredentials: true,
      });
      return commentId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete comment"
      );
    }
  }
);
export const fetchUserComments = createAsyncThunk(
  "forum/fetchUserComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/comments/user", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch user forums"
      );
    }
  }
);
export const toggleCommentLike = createAsyncThunk(
  "comment/toggleLike",
  async (commentId: string, thunkAPI) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to toggle like");
      return { commentId, ...(await res.json()) };
    } catch (error) {
      return thunkAPI.rejectWithValue("Failed to toggle like");
    }
  }
);
const commentSlice = createSlice({
  name: "comment",
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
        state.comments.unshift(action.payload); 
      })
      .addCase(toggleCommentLike.fulfilled, (state, action) => {
        const { commentId, liked, count } = action.payload;
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.userLiked = liked;
          if (!comment._count) comment._count = { likes: 0 };
          comment._count.likes = count;
        }
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
        state.comments = state.comments.filter(
          (comment) => comment.id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
