const mongoose = require('mongoose');

const emailCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailTemplate', required: true },
  subject: String,
  recipients: [{
    email: String,
    name: String,
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    sentAt: Date,
    openedAt: Date,
    clickedAt: Date
  }],
  recipientFilter: {
    type: { type: String, enum: ['all', 'customers', 'subscribers', 'custom'] },
    customEmails: [String]
  },
  scheduledAt: Date,
  sentAt: Date,
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'sending', 'sent', 'cancelled'], 
    default: 'draft' 
  },
  stats: {
    totalRecipients: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('EmailCampaign', emailCampaignSchema);
