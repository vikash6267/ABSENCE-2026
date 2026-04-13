'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Send, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminEmail() {
  const [templates, setTemplates] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [activeTab, setActiveTab] = useState('templates');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('template');
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    subject: '',
    htmlContent: '',
    category: 'marketing'
  });

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    template: '',
    subject: '',
    recipientFilter: { type: 'all' }
  });

  useEffect(() => {
    loadTemplates();
    loadCampaigns();
  }, []);

  const loadTemplates = () => {
    api.get('/email/templates')
      .then(res => setTemplates(res.data))
      .catch(err => console.error(err));
  };

  const loadCampaigns = () => {
    api.get('/email/campaigns')
      .then(res => setCampaigns(res.data))
      .catch(err => console.error(err));
  };

  const handleCreateTemplate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/email/templates', templateForm);
      toast.success('Template created!');
      setShowModal(false);
      loadTemplates();
      setTemplateForm({ name: '', subject: '', htmlContent: '', category: 'marketing' });
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await api.post('/email/campaigns', campaignForm);
      toast.success('Campaign created!');
      setShowModal(false);
      loadCampaigns();
      setCampaignForm({ name: '', template: '', subject: '', recipientFilter: { type: 'all' } });
    } catch (error) {
      toast.error('Failed to create campaign');
    }
  };

  const handleSendCampaign = async (id) => {
    if (confirm('Send this campaign to all recipients?')) {
      try {
        await api.post(`/email/campaigns/${id}/send`);
        toast.success('Campaign sent!');
        loadCampaigns();
      } catch (error) {
        toast.error('Failed to send campaign');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Email Marketing</h1>
        <button
          onClick={() => {
            setModalType(activeTab === 'templates' ? 'template' : 'campaign');
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Plus size={20} />
          {activeTab === 'templates' ? 'New Template' : 'New Campaign'}
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'templates' ? 'bg-black text-white' : 'bg-gray-200'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'campaigns' ? 'bg-black text-white' : 'bg-gray-200'
          }`}
        >
          Campaigns
        </button>
      </div>

      {activeTab === 'templates' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template._id} className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs">
                {template.category}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto overflow-y-hidden rounded-lg border bg-white">
          <table className="w-full min-w-[860px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Campaign</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Recipients</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Sent</th>
                <th className="whitespace-nowrap px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{campaign.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs ${
                      campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                      campaign.status === 'sending' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{campaign.stats.totalRecipients}</td>
                  <td className="whitespace-nowrap px-6 py-4">{campaign.stats.sent}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {campaign.status === 'draft' && (
                      <button
                        onClick={() => handleSendCampaign(campaign._id)}
                        className="flex items-center gap-2 px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                      >
                        <Send size={16} />
                        Send
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && modalType === 'template' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create Email Template</h2>
            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <input
                type="text"
                placeholder="Template Name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Email Subject"
                value={templateForm.subject}
                onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={templateForm.category}
                onChange={(e) => setTemplateForm({ ...templateForm, category: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="marketing">Marketing</option>
                <option value="transactional">Transactional</option>
                <option value="notification">Notification</option>
              </select>
              <textarea
                placeholder="HTML Content (use {{name}} for variables)"
                value={templateForm.htmlContent}
                onChange={(e) => setTemplateForm({ ...templateForm, htmlContent: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows="10"
                required
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModal && modalType === 'campaign' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Create Campaign</h2>
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <input
                type="text"
                placeholder="Campaign Name"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={campaignForm.template}
                onChange={(e) => setCampaignForm({ ...campaignForm, template: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              >
                <option value="">Select Template</option>
                {templates.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Email Subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <select
                value={campaignForm.recipientFilter.type}
                onChange={(e) => setCampaignForm({ 
                  ...campaignForm, 
                  recipientFilter: { type: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="all">All Users</option>
                <option value="customers">Customers Only</option>
              </select>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
