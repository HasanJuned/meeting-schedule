const HostScheduleModel = require('../models/HostScheduleModel');
const GuestProfileModel = require('../models/GuestProfileModel');

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

    res.status(200).json({message:'success' , schedules });
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
  const { scheduleId } = req.params; // Get the schedule ID and guest email from the URL parameters
  let guestEmail = req.params.fullName;
  try {
    // Find the schedule that is available for booking
    const schedule = await HostScheduleModel.findOne({ _id: scheduleId, status: 'available' });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found or not available for booking.' });
    }

    // Check if there are any overlapping bookings
    const overlappingBookings = await HostScheduleModel.find({
      hostEmail: schedule.hostEmail,
      status: 'booked',
      startTime: { $lt: new Date(schedule.endTime) },
      endTime: { $gt: new Date(schedule.startTime) },
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Conflict with another booked schedule.' });
    }

    // Handle overbooking by checking if the count is 0
    if (schedule.count === 0) {
      return res.status(400).json({ message: 'This schedule is already fully booked.' });
    }

    // Reduce the count of available slots and update the status if no slots are available
    schedule.count -= 1;
    if (schedule.count === 0) {
      schedule.status = 'booked';
    }

    // Save the updated schedule
    await schedule.save();

    // Find the guest profile by email to include their info in the response
    const guestInfo = await GuestProfileModel.findOne({ fullName: guestEmail});

    if (!guestInfo) {
      return res.status(404).json({ message: 'Guest not found with this email.' });
    }

    // Send response with both schedule and guest information
    res.status(200).json({
      message: 'Schedule booked successfully.',
      data: {
        schedule: schedule,
        guest: guestInfo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book schedule', error: error.toString() });
  }
};






