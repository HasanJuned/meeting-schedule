const HostScheduleModel = require('../models/HostScheduleModel');
const { DateTime } = require('luxon');



exports.mostBooked = async (req, res) => {
  try {
    const { hostEmail } = req.params;

    const schedules = await HostScheduleModel.find({ hostEmail: hostEmail }).sort({ count: 1 });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this host.' });
    }

    // Convert startDate and endDate to display only the date in YYYY-MM-DD format
    const convertedSchedules = schedules.map(schedule => {
      // Format the startDate to display only the date (YYYY-MM-DD), ignoring the time part
      if (schedule.startDate) {
        schedule.startDate = DateTime.fromISO(schedule.startDate).toFormat('yyyy-MM-dd');
      }

      // Format the endDate to display only the date (YYYY-MM-DD), ignoring the time part
      if (schedule.endDate) {
        schedule.endDate = DateTime.fromISO(schedule.endDate).toFormat('yyyy-MM-dd');
      }

      if (schedule.startTime) {
        // Convert startTime to 12-hour time with AM/PM
        schedule.startTime = DateTime.fromISO(schedule.startTime) // Parse as ISO string
            .toFormat('hh:mm a'); // Format to 12-hour time with AM/PM
      }

      if (schedule.endTime) {
        // Convert endTime to 12-hour time with AM/PM
        schedule.endTime = DateTime.fromISO(schedule.endTime) // Parse as ISO string
            .toFormat('hh:mm a'); // Format to 12-hour time with AM/PM
      }

      return schedule;
    });

    res.status(200).send({ message: 'success', data: convertedSchedules });
  } catch (e) {
    res.status(400).send({ message: 'fail', data: e.toString() });
  }
};
exports.countTodaysMeetings = async (req, res) => {
  try {
    let hostEmail = req.params.hostEmail;
    let hostDate = req.params.startDate;

    if (!hostEmail || !hostDate) {
      return res.status(400).json({
        message: 'Both hostEmail and hostDate parameters are required.',
      });
    }

    const totalMeeting = await HostScheduleModel.countDocuments({
      hostEmail,
      startDate: hostDate,
    });

    if (totalMeeting === 0) {
      return res.status(404).json({ message: 'No schedules found for this email and date.' });
    }

    res.status(200).send({ message: 'success', data: totalMeeting });
  } catch (error) {
    // Handle any errors and send a response
    res.status(500).send({ message: 'fail', data: error.toString() });
  }
};


exports.popularBookingTime = async (req, res) => {
  try {
    const { hostEmail } = req.params;

    const schedules = await HostScheduleModel.find({ hostEmail: hostEmail });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this host.' });
    }

    const bookedSchedules = schedules.filter(schedule => schedule.status === "booked");

    if (bookedSchedules.length === 0) {
      return res.status(404).json({ message: 'No booked schedules found for this host.' });
    }

    console.log('Booked Schedules:', bookedSchedules);

    const timeBookings = bookedSchedules.reduce((acc, schedule) => {
      const startTime = schedule.startTime;

      if (!startTime) {
        console.log('Skipping schedule with no startTime:', schedule);
        return acc;
      }

      if (!acc[startTime]) {
        acc[startTime] = 0;
      }
      acc[startTime]++;

      return acc;
    }, {});

    console.log('Grouped Time Bookings:', timeBookings);

    const sortedTimes = Object.entries(timeBookings)
    .sort((a, b) => b[1] - a[1])  // Sort by count in descending order
        .map(([time, count]) => ({ time, count }));

    console.log('Sorted Times:', sortedTimes);

    res.status(200).send({ message: 'success', data: sortedTimes });
  } catch (e) {
    res.status(400).send({ message: 'fail', data: e.toString() });
  }
};


