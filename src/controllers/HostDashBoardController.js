const HostScheduleModel = require('../models/HostScheduleModel');

exports.mostBooked = async (req, res) => {
  try {
    const { hostEmail } = req.params;

    const schedules = await HostScheduleModel.find({ hostEmail: hostEmail }).sort({ count: 1 });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this host.' });
    }

    res.status(200).send({ message: 'success', data: schedules });
  } catch (e) {
    res.status(400).send({ message: 'fail', data: e.toString() });
  }
};

exports.popularBookingTime = async (req, res) => {
  try {
    const { hostEmail } = req.params;

    // Fetch all schedules for the given host
    const schedules = await HostScheduleModel.find({ hostEmail: hostEmail });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this host.' });
    }

    // Filter for "booked" schedules only
    const bookedSchedules = schedules.filter(schedule => schedule.status === "booked");

    if (bookedSchedules.length === 0) {
      return res.status(404).json({ message: 'No booked schedules found for this host.' });
    }

    // Debugging: Log booked schedules to see what data we have
    console.log('Booked Schedules:', bookedSchedules);

    // Group by startTime and count bookings at each time
    const timeBookings = bookedSchedules.reduce((acc, schedule) => {
      const startTime = schedule.startTime;

      if (!startTime) {
        console.log('Skipping schedule with no startTime:', schedule);
        return acc; // Skip invalid schedules without startTime
      }

      if (!acc[startTime]) {
        acc[startTime] = 0;
      }
      acc[startTime]++;

      return acc;
    }, {});

    // Debugging: Log timeBookings object
    console.log('Grouped Time Bookings:', timeBookings);

    // Sort times by the number of bookings, in descending order
    const sortedTimes = Object.entries(timeBookings)
    .sort((a, b) => b[1] - a[1])  // Sort by count in descending order
        .map(([time, count]) => ({ time, count }));

    // Debugging: Log sorted times
    console.log('Sorted Times:', sortedTimes);

    res.status(200).send({ message: 'success', data: sortedTimes });
  } catch (e) {
    res.status(400).send({ message: 'fail', data: e.toString() });
  }
};


