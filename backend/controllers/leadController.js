const axios = require('axios');

// @desc    Capture lead and forward to webhook
// @route   POST /api/leads
// @access  Public
exports.captureLead = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    const leadData = {
      name,
      email,
      phone: phone || '',
      message: message || '',
      timestamp: new Date().toISOString(),
      source: 'LMS Platform'
    };
    
    // Forward to webhook if configured
    if (process.env.LEAD_WEBHOOK_URL) {
      try {
        await axios.post(process.env.LEAD_WEBHOOK_URL, leadData);
        console.log('Lead forwarded to webhook successfully');
      } catch (webhookError) {
        console.error('Webhook forwarding failed:', webhookError.message);
      }
    }
    
    res.status(201).json({
      message: 'Lead captured successfully',
      lead: leadData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};