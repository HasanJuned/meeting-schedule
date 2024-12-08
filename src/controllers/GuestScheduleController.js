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

  if (time) {
    filter.startTime = time; // Match startTime exactly
  }

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
    const schedule = await HostScheduleModel.findOne({ _id: scheduleId, status: 'available' });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found or not available for booking.' });
    }

    const overlappingBookings = await HostScheduleModel.find({
      hostEmail: schedule.hostEmail,
      status: 'booked',
      startTime: { $lt: new Date(schedule.endTime) },
      endTime: { $gt: new Date(schedule.startTime) },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Conflict with another booked schedule.' });
    }

    // Handle overbooking
    if (schedule.count === 0) {
      return res.status(400).json({ message: 'This schedule is already fully booked.' });
    }

    schedule.count -= 1;
    if (schedule.count === 0) {
      schedule.status = 'booked';
    }

    await schedule.save(); // Save the updated schedule

    res.status(200).json({
      message: 'Schedule booked successfully.',
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book schedule', error });
  }
};





