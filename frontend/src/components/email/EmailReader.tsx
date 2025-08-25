import React from 'react';
import { useGameStore } from '../../stores/gameStore';

const EmailReader: React.FC = () => {
  const { selectedEmail, setComposing } = useGameStore();

  if (!selectedEmail) {
    return (
      <div className="email-content flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-medium mb-2">Select an email to read</h3>
          <p>Choose an email from the inbox to view its contents</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'issue':
        return 'text-red-600';
      case 'result':
        return 'text-blue-600';
      case 'event':
        return 'text-yellow-600';
      case 'notification':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleReply = () => {
    setComposing(true);
  };

  return (
    <div className="email-content flex-1 flex flex-col bg-white">
      {/* Email Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedEmail.subject}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="font-medium">From:</span>
                <span>{selectedEmail.fromName}</span>
                <span className="text-gray-400">({selectedEmail.from})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">To:</span>
                <span>{selectedEmail.to}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
              <span>{formatDate(selectedEmail.timestamp)}</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                selectedEmail.type === 'issue' ? 'bg-red-100 text-red-800' :
                selectedEmail.type === 'result' ? 'bg-blue-100 text-blue-800' :
                selectedEmail.type === 'event' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {selectedEmail.type.charAt(0).toUpperCase() + selectedEmail.type.slice(1)}
              </span>
              {selectedEmail.requiresResponse && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Response Required
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {selectedEmail.requiresResponse && (
            <button
              onClick={handleReply}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>✏️</span>
              <span>Compose Policy Response</span>
            </button>
          )}
          <button className="btn-secondary">
            📁 Archive
          </button>
          <button className="btn-secondary">
            ⭐ Important
          </button>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {selectedEmail.body}
          </div>
        </div>

        {/* Attachments or additional info */}
        {selectedEmail.type === 'result' && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">📊 Policy Impact Summary</h3>
            <p className="text-sm text-blue-700">
              This email contains results from a recent policy implementation. 
              Review the demographic responses and budget impact carefully.
            </p>
          </div>
        )}

        {selectedEmail.type === 'issue' && selectedEmail.requiresResponse && (
          <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-sm font-medium text-orange-800 mb-2">⚠️ Action Required</h3>
            <p className="text-sm text-orange-700">
              This issue requires your attention. Consider the needs of different demographics 
              when crafting your policy response.
            </p>
            <button
              onClick={handleReply}
              className="mt-3 btn-primary text-sm"
            >
              Draft Policy Response
            </button>
          </div>
        )}
      </div>

      {/* Email Footer */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Email ID: {selectedEmail.id}</span>
          <span>Status: {selectedEmail.read ? 'Read' : 'Unread'}</span>
        </div>
      </div>
    </div>
  );
};

export default EmailReader;
