const HostScheduleModel = require('../models/HostScheduleModel');

exports.createSchedule = async (req, res) => {
  const { hostEmail, hostFullName, title, startDate, startTime, endDate, endTime, meetingAddress } = req.body;

  try {
    const schedule = new HostScheduleModel({
      hostEmail,
      hostFullName,
      title,
      startDate: new Date(startDate),
      startTime,
      endDate: new Date(endDate),
      endTime,
      meetingAddress,
    });

    // Save to the database
    const savedSchedule = await schedule.save();
    res.status(200).json({ message: 'success', schedule: savedSchedule });
  } catch (error) {
    console.error('Error creating schedule:', error.message);
    res.status(500).json({ message: 'fail', error: error.message });
  }
};



exports.editSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const updates = req.body;

  const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (updates.startTime && !timeFormat.test(updates.startTime)) {
    return res.status(400).json({ message: 'Invalid startTime format. Use HH:mm (24-hour format).' });
  }

  if (updates.endTime && !timeFormat.test(updates.endTime)) {
    return res.status(400).json({ message: 'Invalid endTime format. Use HH:mm (24-hour format).' });
  }

  try {
    const schedule = await HostScheduleModel.findOneAndUpdate(
        { _id: scheduleId, hostEmail: req.body.hostEmail }, // Match by ID and host email
        updates,
        { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'HostScheduleModel not found or unauthorized' });
    }

    res.json({ message: 'HostScheduleModel updated successfully', schedule });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update schedule', error });
  }
};


exports.deleteSchedule = async (req, res) => {
  const { scheduleId } = req.params;
  const { hostEmail } = req.params;

  try {
    const schedule = await HostScheduleModel.findOneAndDelete({ _id: scheduleId, hostEmail: hostEmail });

    if (!schedule) return res.status(404).json({ message: 'HostScheduleModel not found or unauthorized' });

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete schedule', error });
  }
};
