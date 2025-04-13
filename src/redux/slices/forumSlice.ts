import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export interface Forum {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  tags?: string[];
  userLiked?: boolean;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  _count?: {
    likes: number;
  };
}
interface ForumState {
  forums: Forum[];
  userForums: Forum[];
  selectedForum: Forum | null;
  loading: boolean;
  error: string | null;
}
const initialState: ForumState = {
  forums: [],
  userForums: [],
  selectedForum: null,
  loading: false,
  error: null,
};
// Async Thunks
export const fetchForums = createAsyncThunk(
  "forum/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/forums");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch forums"
      );
    }
  }
);
export const fetchUserForums = createAsyncThunk(
  "forum/fetchUserForums",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/forums/user", {
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
export const fetchForumById = createAsyncThunk(
  "forum/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/forums/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch forum"
      );
    }
  }
);
export const createForum = createAsyncThunk(
  "forum/create",
  async (
    forumData: { title: string; description: string; tags: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("/api/forums", forumData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to create forum"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);
export const updateForum = createAsyncThunk(
  "forum/update",
  async (
    {
      id,
      title,
      description,
      tags,
    }: {
      id: string;
      title: string;
      description: string;
      tags: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `/api/forums/${id}`,
        {
          title,
          description,
          tags,
        },
        {
          withCredentials: true,
        }
      );
      return response.data; // This will become action.payload
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update forum"
      );
    }
  }
);
export const deleteForum = createAsyncThunk(
  "forum/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/forums/${id}`, { withCredentials: true });
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete forum"
      );
    }
  }
);
// ✅ Fixed like endpoint path to `/likes`
export const toggleForumLike = createAsyncThunk(
  "forum/toggleLike",
  async (forumId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/forums/${forumId}/like`, null, {
        withCredentials: true,
      });
      return { forumId, ...response.data };
    } catch (error: any) {
      return rejectWithValue("Failed to toggle like");
    }
  }
);
// Slice
const forumSlice = createSlice({
  name: "forum",
  initialState,
  reducers: {
    clearSelectedForum(state) {
      state.selectedForum = null;
    },
    setForumLikeStatus(state, action) {
      const { forumId, liked, newLikeCount } = action.payload;
      const updateForum = (forum: Forum) => {
        return {
          ...forum,
          userLiked: liked,
          _count: {
            likes: newLikeCount,
          },
        };
      };
      state.forums = state.forums.map((forum) =>
        forum.id === forumId ? updateForum(forum) : forum
      );
      state.userForums = state.userForums.map((forum) =>
        forum.id === forumId ? updateForum(forum) : forum
      );
      if (state.selectedForum?.id === forumId) {
        state.selectedForum = updateForum(state.selectedForum);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchForums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForums.fulfilled, (state, action) => {
        state.loading = false;
        state.forums = action.payload;
      })
      .addCase(fetchForums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserForums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserForums.fulfilled, (state, action) => {
        state.userForums = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserForums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchForumById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForumById.fulfilled, (state, action) => {
        state.selectedForum = action.payload;
        state.loading = false;
      })
      .addCase(fetchForumById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createForum.fulfilled, (state, action) => {
        state.forums.unshift(action.payload);
        state.userForums.unshift(action.payload);
      })
      .addCase(updateForum.fulfilled, (state, action) => {
        const updatedForum = action.payload;
        state.forums = state.forums.map((f) =>
          f.id === updatedForum.id ? updatedForum : f
        );
        state.userForums = state.userForums.map((f) =>
          f.id === updatedForum.id ? updatedForum : f
        );
        if (state.selectedForum?.id === updatedForum.id) {
          state.selectedForum = updatedForum;
        }
      })
      .addCase(toggleForumLike.fulfilled, (state, action) => {
        const { forumId, liked, likeCount } = action.payload;
        const updateForum = (forum?: Forum | null) => {
          if (forum && forum.id === forumId) {
            forum.userLiked = liked;
            forum._count = { likes: likeCount };
          }
        };
        state.forums.forEach(updateForum);
        state.userForums.forEach(updateForum);
        updateForum(state.selectedForum);
      })
      .addCase(deleteForum.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.forums = state.forums.filter((f) => f.id !== deletedId);
        state.userForums = state.userForums.filter((f) => f.id !== deletedId);
        if (state.selectedForum?.id === deletedId) {
          state.selectedForum = null;
        }
      });
  },
});
export const { clearSelectedForum, setForumLikeStatus } = forumSlice.actions;
export default forumSlice.reducer;
