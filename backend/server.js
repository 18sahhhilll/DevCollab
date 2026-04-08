
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const socketHandler = require('./src/socket/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);

/* =========================
   ✅ ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://dev-collab-nine.vercel.app', // 🔥 your frontend URL
];

/* =========================
   ✅ CORS MIDDLEWARE
========================= */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

/* =========================
   ✅ BODY PARSING
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ✅ SOCKET.IO SETUP
========================= */
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

/* =========================
   ✅ ATTACH IO TO REQUEST
========================= */
app.use((req, _res, next) => {
  req.io = io;
  next();
});

/* =========================
   ✅ ROUTES
========================= */
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/projects', require('./src/routes/projects'));
app.use('/api/applications', require('./src/routes/applications'));
app.use('/api/chat', require('./src/routes/chat'));

/* =========================
   ✅ HEALTH CHECK
========================= */
app.get('/', (_req, res) => {
  res.send('API running...');
});

app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', timestamp: new Date() })
);

/* =========================
   ✅ GLOBAL ERROR HANDLER
========================= */
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

/* =========================
   ✅ SOCKET HANDLER
========================= */
socketHandler(io);

/* =========================
   ✅ DATABASE + SERVER START
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

