const express = require('express');
const router = express.Router();
const EmailTemplate = require('../models/EmailTemplate');
const EmailCampaign = require('../models/EmailCampaign');
const User = require('../models/User');
const { sendEmail, replaceVariables } = require('../utils/email');
const { protect, authorize } = require('../middleware/auth');

router.get('/templates', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const templates = await EmailTemplate.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/templates', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const template = await EmailTemplate.create(req.body);
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/templates/:id', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const template = await EmailTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/campaigns', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const campaigns = await EmailCampaign.find().populate('template');
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/campaigns', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const campaign = await EmailCampaign.create(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/campaigns/:id/send', protect, authorize('admin', 'superadmin'), async (req, res) => {
  try {
    const campaign = await EmailCampaign.findById(req.params.id).populate('template');
    
    let recipients = [];
    if (campaign.recipientFilter.type === 'all') {
      const users = await User.find({ isActive: true });
      recipients = users.map(u => ({ email: u.email, name: u.name }));
    } else if (campaign.recipientFilter.type === 'custom') {
      recipients = campaign.recipientFilter.customEmails.map(email => ({ email }));
    }
    
    campaign.recipients = recipients.map(r => ({ ...r, status: 'pending' }));
    campaign.stats.totalRecipients = recipients.length;
    campaign.status = 'sending';
    await campaign.save();
    
    for (let recipient of campaign.recipients) {
      try {
        const html = replaceVariables(campaign.template.htmlContent, { name: recipient.name || 'Customer' });
        await sendEmail({
          to: recipient.email,
          subject: campaign.subject || campaign.template.subject,
          html
        });
        
        recipient.status = 'sent';
        recipient.sentAt = new Date();
        campaign.stats.sent++;
      } catch (error) {
        recipient.status = 'failed';
        campaign.stats.failed++;
      }
    }
    
    campaign.status = 'sent';
    campaign.sentAt = new Date();
    await campaign.save();
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
