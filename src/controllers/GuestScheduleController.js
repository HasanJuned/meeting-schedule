const HostScheduleModel = require('../models/HostScheduleModel');

exports.searchSchedules = async (req, res) => {
  const { date, time, hostName } = req.body;

  const filter = {}; // Initialize the filter object

  // If date is provided, filter by the exact day (ignoring the time)
  if (date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999); // Set the time to the end of the day (23:59:59)
    filter.startDate = { $gte: startOfDay, $lte: endOfDay }; // Match the date range
  }

  // If time is provided, filter by the exact start time (no ranges, exact match)
  if (time) {
    filter.startTime = time; // Match startTime exactly
  }

  // If hostEmail is provided, filter by hostEmail (case-insensitive match)
  if (hostName) {
    filter.hostEmail = { $regex: hostName, $options: 'i' }; // Case-insensitive match for hostEmail
  }

  try {
    const schedules = await HostScheduleModel.find(filter);

    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found matching the filters.' });
    }

    res.status(200).json({ schedules });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search schedules', error });
  }
};

exports.allSchedules = async (req, res) => {

  try {
    const schedules = await HostScheduleModel.find();
    res.status(200).json({ message:'success', data: schedules });
  } catch (error) {
    res.status(500).json({ message: 'fail', data: error });
  }
};

exports.bookSchedule = async (req, res) => {
  const { scheduleId } = req.params; // Get the schedule ID from the URL parameter

  try {
    const schedule = await HostScheduleModel.findOne({ _id: scheduleId });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }

    if (schedule.count === 0) {
      return res.status(400).json({ message: 'This schedule is already booked.' });
    }

    schedule.count -= 1;
    if (schedule.count === 0) {
      schedule.status = 'booked';
    }
    await schedule.save();

    res.status(200).json({
      message: 'Schedule booked successfully.',
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book schedule', error });
  }
};





