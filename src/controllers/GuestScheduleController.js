const HostScheduleModel = require('../models/HostScheduleModel');
const GuestProfileModel = require('../models/GuestProfileModel');
const { DateTime } = require('luxon');

exports.searchSchedules = async (req, res) => {
  const { date, time, hostName } = req.body;

  const filter = {};

  if (date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    filter.startDate = { $gte: startOfDay, $lte: endOfDay };
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

    res.status(200).json({message:'success' , schedules });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search schedules', error });
  }
};

exports.allSchedules = async (req, res) => {
  try {
    const schedules = await HostScheduleModel.find();

    // Convert date-time fields to desired format
    const convertedSchedules = schedules.map(schedule => {
      if (schedule.startTime) {
        schedule.startTime = DateTime.fromISO(schedule.startTime)
            .toFormat('hh:mm a');
      }
      if (schedule.endTime) {
        schedule.endTime = DateTime.fromISO(schedule.endTime)
            .toFormat('hh:mm a');
      }
      return schedule;
    });

    res.status(200).json({ message: 'success', data: convertedSchedules });
  } catch (error) {
    res.status(500).json({ message: 'fail', data: error });
  }
};

exports.allGuest = async (req, res) => {
  try {
    const allGuest = await GuestProfileModel.find();
    res.status(200).json({ message: 'success', data: allGuest });
  } catch (error) {
    res.status(500).json({ message: 'fail', data: error });
  }
};

exports.deleteallGuest = async (req, res) => {

  let id = req.params.id;
  try {
    const allGuest = await GuestProfileModel.deleteOne({_id: id});
    res.status(200).json({ message: 'success', data: allGuest });
  } catch (error) {
    res.status(500).json({ message: 'fail', data: error });
  }
};

exports.bookSchedule = async (req, res) => {
  const { scheduleId } = req.params; // Get the schedule ID and guest email from the URL parameters
  let guestEmail = req.params.fullName;
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

    if (schedule.count === 0) {
      return res.status(400).json({ message: 'This schedule is already fully booked.' });
    }

    schedule.count -= 1;
    if (schedule.count === 0) {
      schedule.status = 'booked';
    }

    await schedule.save();

    //const guestInfo = await GuestProfileModel.findOne({ fullName: guestEmail});

    // if (!guestInfo) {
    //   return res.status(404).json({ message: 'Guest not found with this email.' });
    // }

    res.status(200).json({
      message: 'Schedule booked successfully.',
      data: {
        schedule: schedule,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book schedule', error: error.toString() });
  }
};






