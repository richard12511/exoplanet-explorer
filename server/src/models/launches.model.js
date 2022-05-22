const launchesDb = require('./launches.mongo');
const planets = require('./planets.mongo');
const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['NASA', 'Space X'],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

launches.set(launch.flightNumber, launch);

async function getAllLaunches() {
  return await launchesDb.find({}, { _id: 0, __v: 0 });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDb.findOne().sort('-flightNumber');
  if (!latestLaunch) {
    return 100;
  }

  return latestLaunch.flightNumber;
}

async function launchExists(id) {
  return await launchesDb.findOne({ flightNumber: id });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['NASA'],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunch(id) {
  const aborted = await launchesDb.updateOne({ flightNumber: id }, { upcoming: false, success: false });
  return aborted.ok === 1 && aborted.nModified === 1;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching planet found');
  }

  await launchesDb.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}

module.exports = {
  getAllLaunches,
  launchExists,
  scheduleNewLaunch,
  abortLaunch,
};
