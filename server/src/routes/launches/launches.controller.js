const { getAllLaunches, abortLaunch, launchExists, scheduleNewLaunch } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
  const launches = await getAllLaunches();
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400).json({
      error: 'Missing required launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid date',
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = req.params.id;
  const exists = await launchExists(launchId);
  if (!exists) {
    return res.status(404).json({ error: 'Launch not found' });
  }

  const aborted = await abortLaunch(launchId);
  if (!aborted) {
    return res.status(400).json({ error: 'Launch not aborted' });
  }

  return res.status(200).json({ ok: true });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
