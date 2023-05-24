import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import NotificationPage from 'scenes/notificationPage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from 'theme';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatPage from 'scenes/chatPage/ChatPage';
import PostDetail from 'scenes/postPage';
import ResetPassword from 'scenes/loginPage/ResetPassword';
import LoginWithCode from 'scenes/loginPage/LoginWithCode';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route
              path='/home'
              element={isAuth ? <HomePage /> : <Navigate to='/' />}
            />
            <Route
              path='/resetPassword/:resetToken'
              element={<ResetPassword />}
            />
            {/* <Route path='/loginWithCode/:email' element={<LoginWithCode />} /> */}

            <Route
              path='/notifications'
              element={isAuth ? <NotificationPage /> : <Navigate to='/' />}
            />
            <Route
              path='/chat'
              element={isAuth ? <ChatPage /> : <Navigate to='/' />}
            />
            <Route
              path='/posts/:postId'
              element={isAuth ? <PostDetail /> : <Navigate to='/' />}
            />
            <Route
              path='/profile/:userId'
              element={isAuth ? <ProfilePage /> : <Navigate to='/' />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
