
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const postsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

// Connect to MongoDB
async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn(
        'MONGODB_URI is missing. Create a .env file in backend/ before testing database features.'
      );
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'blog',
    });

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

// Middleware
app.locals.publicDir = publicDir;

app.use(cors());
app.use(express.json());
app.use(express.static(publicDir));

// Mount API routes
app.use('/api/posts', postsRouter);

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Mounted routers:');
    console.log('  /api/posts -> routes/posts.js');
  });
});
