import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light',
  user: null,
  token: null,
  posts: [],
  notifications: {
    read: [],
    unread: [],
  },
  socket: null,
  unreadCount: 0,
  selectedChat: null,
  chats: [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error('user friends non-existent');
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) {
          return action.payload.post;
        }
        return post;
      });

      state.posts = updatedPosts;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setNotifications,
  setSocket,
  setUnreadCount,
  setSelectedChat,
  setChats,
} = authSlice.actions;

export default authSlice.reducer;
