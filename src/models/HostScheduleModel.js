const mongoose = require('mongoose');

const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;

const DataSchema = new mongoose.Schema({
  hostEmail: { type: String, required: true },
  hostFullName: { type: String, required: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true }, // Only date, no time component
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: (v) => timeFormat.test(v),
      message: props => `${props.value} is not a valid time in HH:mm format!`
    }
  }, // 24-hour time format as string
  endDate: { type: Date, required: true },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: (v) => timeFormat.test(v),
      message: props => `${props.value} is not a valid time in HH:mm format!`
    }
  },
  meetingAddress: { type: String, required: true },
  status: { type: String, default: 'available' },
  count: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
});

const HostScheduleModel = mongoose.model('hostSchedule', DataSchema);
module.exports = HostScheduleModel;
