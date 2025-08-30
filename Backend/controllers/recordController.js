const MedicalRecord = require('../models/MedicalRecord');
const { formatResponse } = require('../utils/responseFormatter');

exports.list = async (req, res) => {
  try {
    const items = await MedicalRecord.find().limit(50);
    res.json(formatResponse(true, 'Records', { items }));
  } catch (e) {
    res.status(500).json(formatResponse(false, 'Failed to list records'));
  }
};


