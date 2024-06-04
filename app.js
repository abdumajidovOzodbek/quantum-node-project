const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const http = require('http')
const userRoutes = require('./routes/userRoutes');
const socketIO = require('socket.io');
const Message = require('./models/Message');
const cors = require('cors');
const messgaeRoute = require('./routes/messageRoute');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const User = require('./models/User');
const multer = require('multer');
const app = express();
const server = http.createServer(app);
const { ObjectId } = mongoose.mongo

app.use(cors())
const io = new socketIO.Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Handle chat messages
  socket.on('chat message', async (data) => {
    try {
      const { sender, receiverId, type, content, mediaUrl } = data;

      // Save the message to the database
      const message = new Message({
        sender: new ObjectId(sender),
        receiver: new ObjectId(receiverId),
        type,
        content,
        mediaUrl,
      });
      await message.save();

      // Fetch the latest message to send back to the clients
      const savedMessage = await Message.findById(message._id);

      // Emit the new message to the sender and receiver
      io.to(sender).emit('chat message', savedMessage);
      io.to(receiverId).emit('chat message', savedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });
  socket.on('join room', (userId) => {
    socket.join(userId);
  });
  socket.on('chats', async (id) => {
    // console.log(message);


    const messages = await Message.find({ sender: new ObjectId(id) })
    console.log(id);
    socket.emit('datas', messages);
    // console.log(new ObjectId(message));

    // console.log(messages);
    // socket.emit('chat message', messages);
  })
});
app.use(express.json());
app.use('/uploads', express.static('uploads'));
mongoose.connect('mongodb://localhost:27017/quantum')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));
app.use('/auth', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes);
app.use('/', messgaeRoute);
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ message: 'File size too large. Limit 50 mb' });
    } else {
      res.status(500).send('An unexpected error occurred');
    };
  } else if (err) {
    // An unknown error occurred
    res.status(500).send('An unexpected error occurred');
  } else {
    // Continue to the next middleware if no error occurred
    next();
  }
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
