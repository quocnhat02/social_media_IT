/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state';
import PostWidget from './PostWidget';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const [profile, setProfile] = useState(isProfile);

  const getPosts = async () => {
    const response = await fetch('http://localhost:3001/posts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    socket.on('new post', (post) => {
      getPosts();
    });

    if (isProfile) {
      setProfile(true);
      getUserPosts();
    } else {
      setProfile(false);
      getPosts();
    }
  }, []);

  return (
    <>
      {profile
        ? posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              title,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) =>
              user._id === userId && (
                <PostWidget
                  key={_id}
                  postId={_id}
                  postUserId={userId}
                  name={`${firstName} ${lastName}`}
                  title={title}
                  description={description}
                  location={location}
                  picturePath={picturePath}
                  userPicturePath={userPicturePath}
                  likes={likes}
                  comments={comments}
                ></PostWidget>
              )
          )
        : posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              title,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                title={title}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              ></PostWidget>
            )
          )}
    </>
  );
};

export default PostsWidget;
