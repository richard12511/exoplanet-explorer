const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadSpaceXLaunchesData } = require('./models/launches.model');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 8000;
const MONGO_URL =
  'mongodb+srv://richard12511:mFhA4ma9pHaGUjmw@cluster0.cwmai.mongodb.net/nasa?retryWrites=true&w=majority';
const server = http.createServer(app);

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});
mongoose.connection.on('error', err => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();
  await loadSpaceXLaunchesData();
  server.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
  });
}

startServer();
