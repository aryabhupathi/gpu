// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { Forum } from '@/types';

// interface ForumState {
//   forums: Forum[];
//   currentForum: Forum | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ForumState = {
//   forums: [],
//   currentForum: null,
//   loading: false,
//   error: null,
// };

// export const fetchForums = createAsyncThunk(
//   'forum/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/forums');
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forums');
//     }
//   }
// );

// export const fetchForumById = createAsyncThunk(
//   'forum/fetchById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/forums/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forum');
//     }
//   }
// );

// export const createForum = createAsyncThunk(
//   'forum/create',
//   async (forumData: { title: string; description: string; tags: string[] }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('/api/forums', forumData);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to create forum');
//     }
//   }
// );

// export const updateForum = createAsyncThunk(
//   'forum/update',
//   async (
//     { id, forumData }: { id: string; forumData: { title: string; description: string; tags: string[] } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.put(`/api/forums/${id}`, forumData);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to update forum');
//     }
//   }
// );

// export const deleteForum = createAsyncThunk(
//   'forum/delete',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axios.delete(`/api/forums/${id}`);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete forum');
//     }
//   }
// );

// const forumSlice = createSlice({
//   name: 'forum',
//   initialState,
//   reducers: {
//     clearCurrentForum(state) {
//       state.currentForum = null;
//     },
//     setForumLikeStatus(state, action: PayloadAction<{ forumId: string; liked: boolean }>) {
//       const { forumId, liked } = action.payload;
      
//       // Update in forums list
//       const forumIndex = state.forums.findIndex(forum => forum.id === forumId);
//       if (forumIndex !== -1) {
//         const forum = state.forums[forumIndex];
//         state.forums[forumIndex] = {
//           ...forum,
//           userLiked: liked,
//           _count: {
//             ...forum._count,
//             likes: (forum._count?.likes || 0) + (liked ? 1 : -1)
//           }
//         };
//       }
      
//       // Update current forum if it's the one being liked
//       if (state.currentForum && state.currentForum.id === forumId) {
//         state.currentForum = {
//           ...state.currentForum,
//           userLiked: liked,
//           _count: {
//             ...state.currentForum._count,
//             likes: (state.currentForum._count?.likes || 0) + (liked ? 1 : -1)
//           }
//         };
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForums.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForums.fulfilled, (state, action) => {
//         state.loading = false;
//         state.forums = action.payload;
//       })
//       .addCase(fetchForums.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchForumById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForumById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentForum = action.payload;
//       })
//       .addCase(fetchForumById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(createForum.fulfilled, (state, action) => {
//         state.forums.unshift(action.payload);
//       })
//       .addCase(updateForum.fulfilled, (state, action) => {
//         const updatedForum = action.payload;
//         const index = state.forums.findIndex(forum => forum.id === updatedForum.id);
//         if (index !== -1) {
//           state.forums[index] = updatedForum;
//         }
//         if (state.currentForum && state.currentForum.id === updatedForum.id) {
//           state.currentForum = updatedForum;
//         }
//       })
//       .addCase(deleteForum.fulfilled, (state, action) => {
//         state.forums = state.forums.filter(forum => forum.id !== action.payload);
//         if (state.currentForum && state.currentForum.id === action.payload) {
//           state.currentForum = null;
//         }
//       });
//   },
// });

// export const { clearCurrentForum, setForumLikeStatus } = forumSlice.actions;
// export default forumSlice.reducer;



// interface ForumState {
//   forums: any[];
//   currentForum: any | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ForumState = {
//   forums: [],
//   currentForum: null,
//   loading: false,
//   error: null,
// };


// export const fetchForumById = createAsyncThunk(
//   'forum/fetchById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/forums/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forum');
//     }
//   }
// );


// export interface Forum {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   tags?: string[];
//   // Add other fields as needed
// }

// interface ForumState {
//   forums: Forum[];
//   selectedForum: Forum | null; // <- ADD THIS
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ForumState = {
//   forums: [],
//   selectedForum: null, // <- ADD THIS
//   loading: false,
//   error: null,
// };

// export const fetchForums = createAsyncThunk(
//   'forum/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/forums');
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forums');
//     }
//   }
// );

// export const fetchForumById = createAsyncThunk(
//   'forum/fetchById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/forums/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forum');
//     }
//   }
// );

// export const createForum = createAsyncThunk(
//   'forums/create',
//   async (
//     forumData: { title: string; description: string; tags: string[] },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post('/api/forums', forumData, {
//         withCredentials: true,
//       });
      
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to create forum');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );


// export const updateForum = createAsyncThunk(
//   'forum/update',
//   async (
//     { id, forumData }: { id: string; forumData: { title: string; description: string; tags: string[] } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.put(`/api/forums/${id}`, forumData);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to update forum');
//     }
//   }
// );

// export const deleteForum = createAsyncThunk(
//   'forum/delete',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axios.delete(`/api/forums/${id}`);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete forum');
//     }
//   }
// );

// const forumSlice = createSlice({
//   name: 'forum',
//   initialState,
//   reducers: {
//     clearCurrentForum(state) {
//       state.currentForum = null;
//     },
//     setForumLikeStatus(state, action) {
//       const { forumId, liked } = action.payload;

//       // Update in forums list
//       const forumIndex = state.forums.findIndex(forum => forum.id === forumId);
//       if (forumIndex !== -1) {
//         const forum = state.forums[forumIndex];
//         state.forums[forumIndex] = {
//           ...forum,
//           userLiked: liked,
//           _count: {
//             ...forum._count,
//             likes: (forum._count?.likes || 0) + (liked ? 1 : -1)
//           }
//         };
//       }

//       // Update current forum if it's the one being liked
//       if (state.currentForum && state.currentForum.id === forumId) {
//         state.currentForum = {
//           ...state.currentForum,
//           userLiked: liked,
//           _count: {
//             ...state.currentForum._count,
//             likes: (state.currentForum._count?.likes || 0) + (liked ? 1 : -1)
//           }
//         };
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForums.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForums.fulfilled, (state, action) => {
//         state.loading = false;
//         state.forums = action.payload;
//       })
//       .addCase(fetchForums.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(fetchForumById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForumById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentForum = action.payload;
//       })
//       .addCase(fetchForumById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(createForum.fulfilled, (state, action) => {
//         state.forums.unshift(action.payload);
//       })
//       .addCase(updateForum.fulfilled, (state, action) => {
//         const updatedForum = action.payload;
//         const index = state.forums.findIndex(forum => forum.id === updatedForum.id);
//         if (index !== -1) {
//           state.forums[index] = updatedForum;
//         }
//         if (state.currentForum && state.currentForum.id === updatedForum.id) {
//           state.currentForum = updatedForum;
//         }
//       })
//       .addCase(deleteForum.fulfilled, (state, action) => {
//         state.forums = state.forums.filter(forum => forum.id !== action.payload);
//         if (state.currentForum && state.currentForum.id === action.payload) {
//           state.currentForum = null;
//         }
//       });
//   },
// });

// export const { clearCurrentForum, setForumLikeStatus } = forumSlice.actions;
// export default forumSlice.reducer;


// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// export interface Forum {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   tags?: string[];
//   userLiked?: boolean;
//   _count?: {
//     likes: number;
//   };
// }

// interface ForumState {
//   forums: Forum[];
//   selectedForum: Forum | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ForumState = {
//   forums: [],
//   selectedForum: null,
//   loading: false,
//   error: null,
// };

// // Thunks
// export const fetchForums = createAsyncThunk(
//   'forum/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/forums');
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forums');
//     }
//   }
// );

// export const fetchForumById = createAsyncThunk(
//   'forum/fetchById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/forums/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forum');
//     }
//   }
// );

// export const createForum = createAsyncThunk(
//   'forums/create',
//   async (
//     forumData: { title: string; description: string; tags: string[] },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post('/api/forums', forumData, {
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to create forum');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// export const updateForum = createAsyncThunk(
//   'forum/update',
//   async (
//     { id, forumData }: { id: string; forumData: { title: string; description: string; tags: string[] } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.put(`/api/forums/${id}`, forumData);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to update forum');
//     }
//   }
// );

// export const deleteForum = createAsyncThunk(
//   'forum/delete',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axios.delete(`/api/forums/${id}`);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete forum');
//     }
//   }
// );

// export const toggleForumLike = async (forumId: string, liked: boolean) => {
//   const response = await axios.post('/api/forums/like', { forumId, liked });
//   return response.data;
// };


// // Slice
// const forumSlice = createSlice({
//   name: 'forum',
//   initialState,
//   reducers: {
//     clearSelectedForum(state) {
//       state.selectedForum = null;
//     },
//     setForumLikeStatus(state, action) {
//       const { forumId, liked } = action.payload;

//       // Update in forums list
//       const forumIndex = state.forums.findIndex(forum => forum.id === forumId);
//       if (forumIndex !== -1) {
//         const forum = state.forums[forumIndex];
//         state.forums[forumIndex] = {
//           ...forum,
//           userLiked: liked,
//           _count: {
//             ...forum._count,
//             likes: (forum._count?.likes || 0) + (liked ? 1 : -1),
//           },
//         };
//       }

//       // Update selected forum
//       if (state.selectedForum && state.selectedForum.id === forumId) {
//         state.selectedForum = {
//           ...state.selectedForum,
//           userLiked: liked,
//           _count: {
//             ...state.selectedForum._count,
//             likes: (state.selectedForum._count?.likes || 0) + (liked ? 1 : -1),
//           },
//         };
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForums.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForums.fulfilled, (state, action) => {
//         state.loading = false;
//         state.forums = action.payload;
//       })
//       .addCase(fetchForums.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(fetchForumById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForumById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedForum = action.payload;
//       })
//       .addCase(fetchForumById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(createForum.fulfilled, (state, action) => {
//         state.forums.unshift(action.payload);
//       })

//       .addCase(updateForum.fulfilled, (state, action) => {
//         const updatedForum = action.payload;
//         const index = state.forums.findIndex(forum => forum.id === updatedForum.id);
//         if (index !== -1) {
//           state.forums[index] = updatedForum;
//         }
//         if (state.selectedForum && state.selectedForum.id === updatedForum.id) {
//           state.selectedForum = updatedForum;
//         }
//       })

//       .addCase(deleteForum.fulfilled, (state, action) => {
//         state.forums = state.forums.filter(forum => forum.id !== action.payload);
//         if (state.selectedForum && state.selectedForum.id === action.payload) {
//           state.selectedForum = null;
//         }
//       });
//   },
// });

// export const { clearSelectedForum, setForumLikeStatus } = forumSlice.actions;
// export default forumSlice.reducer;



// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';

// export interface Forum {
//   id: string;
//   title: string;
//   description: string;
//   createdAt: string;
//   tags?: string[];
//   userLiked?: boolean;
//   _count?: {
//     likes: number;
//   };
// }

// interface ForumState {
//   forums: Forum[];
//   selectedForum: Forum | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: ForumState = {
//   forums: [],
//   selectedForum: null,
//   loading: false,
//   error: null,
// };

// // Thunks
// export const fetchForums = createAsyncThunk(
//   'forum/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('/api/forums');
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forums');
//     }
//   }
// );

// export const fetchForumById = createAsyncThunk(
//   'forum/fetchById',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`/api/forums/${id}`);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to fetch forum');
//     }
//   }
// );

// export const createForum = createAsyncThunk(
//   'forums/create',
//   async (
//     forumData: { title: string; description: string; tags: string[] },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.post('/api/forums', forumData, {
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         return rejectWithValue(error.response?.data?.error || 'Failed to create forum');
//       }
//       return rejectWithValue('An unknown error occurred');
//     }
//   }
// );

// export const updateForum = createAsyncThunk(
//   'forum/update',
//   async (
//     { id, forumData }: { id: string; forumData: { title: string; description: string; tags: string[] } },
//     { rejectWithValue }
//   ) => {
//     try {
//       const response = await axios.put(`/api/forums/${id}`, forumData);
//       return response.data;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to update forum');
//     }
//   }
// );

// export const deleteForum = createAsyncThunk(
//   'forum/delete',
//   async (id: string, { rejectWithValue }) => {
//     try {
//       await axios.delete(`/api/forums/${id}`);
//       return id;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.error || 'Failed to delete forum');
//     }
//   }
// );

// export const toggleForumLike = async (forumId: string, liked: boolean) => {
//   const response = await axios.post('/api/forums/likes', { forumId, liked });
//   return response.data; // Return like count
// };

// // Slice
// const forumSlice = createSlice({
//   name: 'forum',
//   initialState,
//   reducers: {
//     clearSelectedForum(state) {
//       state.selectedForum = null;
//     },
//     setForumLikeStatus(state, action) {
//       const { forumId, liked, newLikeCount } = action.payload;

//       // Update in forums list
//       const forumIndex = state.forums.findIndex(forum => forum.id === forumId);
//       if (forumIndex !== -1) {
//         const forum = state.forums[forumIndex];
//         state.forums[forumIndex] = {
//           ...forum,
//           userLiked: liked,
//           _count: {
//             likes: newLikeCount,
//           },
//         };
//       }

//       // Update selected forum
//       if (state.selectedForum && state.selectedForum.id === forumId) {
//         state.selectedForum = {
//           ...state.selectedForum,
//           userLiked: liked,
//           _count: {
//             likes: newLikeCount,
//           },
//         };
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchForums.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForums.fulfilled, (state, action) => {
//         state.loading = false;
//         state.forums = action.payload;
//       })
//       .addCase(fetchForums.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(fetchForumById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchForumById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.selectedForum = action.payload;
//       })
//       .addCase(fetchForumById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//       .addCase(createForum.fulfilled, (state, action) => {
//         state.forums.unshift(action.payload);
//       })

//       .addCase(updateForum.fulfilled, (state, action) => {
//         const updatedForum = action.payload;
//         const index = state.forums.findIndex(forum => forum.id === updatedForum.id);
//         if (index !== -1) {
//           state.forums[index] = updatedForum;
//         }
//         if (state.selectedForum && state.selectedForum.id === updatedForum.id) {
//           state.selectedForum = updatedForum;
//         }
//       })

//       .addCase(deleteForum.fulfilled, (state, action) => {
//         state.forums = state.forums.filter(forum => forum.id !== action.payload);
//         if (state.selectedForum && state.selectedForum.id === action.payload) {
//           state.selectedForum = null;
//         }
//       });
//   },
// });

// export const { clearSelectedForum, setForumLikeStatus } = forumSlice.actions;
// export default forumSlice.reducer;



import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

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

// Thunks
export const fetchForums = createAsyncThunk(
  'forum/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/forums');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch forums');
    }
  }
);

export const fetchUserForums = createAsyncThunk(
  'forum/fetchUserForums',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/forums/user', { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user forums');
    }
  }
);

export const fetchForumById = createAsyncThunk(
  'forum/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/forums/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch forum');
    }
  }
);

export const createForum = createAsyncThunk(
  'forum/create',
  async (
    forumData: { title: string; description: string; tags: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/forums', forumData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'Failed to create forum');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateForum = createAsyncThunk(
  'forum/update',
  async (
    { id, forumData }: { id: string; forumData: { title: string; description: string; tags: string[] } },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/api/forums/${id}`, forumData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update forum');
    }
  }
);

export const deleteForum = createAsyncThunk(
  'forum/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/forums/${id}`, { withCredentials: true });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete forum');
    }
  }
);

export const toggleForumLike = async (forumId: string, liked: boolean) => {
  const response = await axios.post('/api/forums/likes', { forumId, liked }, {
    withCredentials: true,
  });
  return response.data; // Return like count
};

// Slice
const forumSlice = createSlice({
  name: 'forum',
  initialState,
  reducers: {
    clearSelectedForum(state) {
      state.selectedForum = null;
    },
    setForumLikeStatus(state, action) {
      const { forumId, liked, newLikeCount } = action.payload;

      // Update in forums list
      const forumIndex = state.forums.findIndex(forum => forum.id === forumId);
      if (forumIndex !== -1) {
        state.forums[forumIndex] = {
          ...state.forums[forumIndex],
          userLiked: liked,
          _count: {
            likes: newLikeCount,
          },
        };
      }

      // Update selected forum
      if (state.selectedForum && state.selectedForum.id === forumId) {
        state.selectedForum = {
          ...state.selectedForum,
          userLiked: liked,
          _count: {
            likes: newLikeCount,
          },
        };
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
        state.forums = action.payload; // ✅ forums should get stored here
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
        state.loading = false;
        state.selectedForum = action.payload;
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
        state.forums = state.forums.map(f =>
          f.id === updatedForum.id ? updatedForum : f
        );
        state.userForums = state.userForums.map(f =>
          f.id === updatedForum.id ? updatedForum : f
        );
        if (state.selectedForum?.id === updatedForum.id) {
          state.selectedForum = updatedForum;
        }
      })

      .addCase(deleteForum.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.forums = state.forums.filter(forum => forum.id !== deletedId);
        state.userForums = state.userForums.filter(forum => forum.id !== deletedId);
        if (state.selectedForum?.id === deletedId) {
          state.selectedForum = null;
        }
      });
  },
});

export const { clearSelectedForum, setForumLikeStatus } = forumSlice.actions;
export default forumSlice.reducer;
