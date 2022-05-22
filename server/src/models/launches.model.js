const launchesDb = require('./launches.mongo');
const launches = new Map();

let latestFlightNumber = 100;

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
  // return Array.from(launches.values());
  return await launchesDb.find({}, { _id: 0, __v: 0 });
}

function launchExists(id) {
  const launchId = Number(id);
  const exists = launches.has(launchId);
  console.log(launches);
  console.log(exists);
  return exists;
}

async function addNewLaunch(launch) {
  latestFlightNumber++;
  const didSet = launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customers: ['NASA'],
      upcoming: true,
      success: true,
    })
  );
  return didSet;
}

async function abortLaunch(id) {
  const aborted = launches.get(Number(id));
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

async function saveLaunch(launch) {
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
  addNewLaunch,
  abortLaunch,
};
