import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import { register } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middlewares/auth.js';
import http from 'http';
import { Server } from 'socket.io';
import compression from 'compression';
import { errorHandler, notFound } from './middlewares/error.js';

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

// MIDDLEWARES
app.use(compression());
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
// app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILES
app.post('/auth/register', upload.single('picture'), register);
app.post('/posts', verifyToken, upload.single('picture'), createPost);

// ROUTES
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  // join room
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  // listen for new notification
  socket.on('newNotification', (notification) => {
    socket.to(notification.userId).emit('newNotification', notification);
  });

  // chat
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User Joined Room: ' + room);
  });

  socket.on('new message', (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log('chat.users not defined');
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  // socket.on('typing', (room) => {
  //   socket.in(room).emit('typing');
  // });

  // socket.on('stop typing', (room) => {
  //   socket.in(room).emit('stop typing');
  // });

  socket.off('setup', (userData) => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});

// MONGOOSE
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log(`${err} did not connect`));
