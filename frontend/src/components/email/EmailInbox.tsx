import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import type { Email } from '../../types';

interface EmailItemProps {
  email: Email;
  isSelected: boolean;
  onClick: () => void;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, isSelected, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getTypeIcon = (type: Email['type']) => {
    switch (type) {
      case 'issue':
        return '⚠️';
      case 'result':
        return '📊';
      case 'event':
        return '📰';
      case 'notification':
        return '📢';
      default:
        return '📧';
    }
  };

  const getTypeBadge = (type: Email['type']) => {
    const colors = {
      issue: 'bg-red-100 text-red-800',
      result: 'bg-blue-100 text-blue-800',
      event: 'bg-yellow-100 text-yellow-800',
      notification: 'bg-green-100 text-green-800',
    };
    
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className={`email-item p-3 border-b cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
      } ${!email.read ? 'email-item unread font-medium bg-blue-25' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="text-lg">{getTypeIcon(email.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`text-sm truncate ${!email.read ? 'font-semibold' : 'font-medium'}`}>
                {email.fromName}
              </p>
              <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                {formatDate(email.timestamp)}
              </p>
            </div>
            <p className={`text-sm truncate ${!email.read ? 'font-medium' : ''}`}>
              {email.subject}
            </p>
            <p className="text-xs text-gray-600 truncate mt-1">
              {email.body.substring(0, 100)}...
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(email.type)}`}>
                {email.type.charAt(0).toUpperCase() + email.type.slice(1)}
              </span>
              {email.requiresResponse && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Response Required
                </span>
              )}
            </div>
          </div>
        </div>
        {!email.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
};

const EmailInbox: React.FC = () => {
  const { emails, selectedEmail, selectEmail } = useGameStore();

  // Mock emails for development
  const mockEmails: Email[] = [
    {
      id: '1',
      from: 'mayor@townhall.gov',
      fromName: 'Mayor Johnson',
      to: 'player@townhall.gov',
      subject: 'Welcome to Office!',
      body: 'Congratulations on your election! As the new town administrator, you\'ll be making important decisions that affect our community...',
      timestamp: new Date().toISOString(),
      type: 'notification',
      requiresResponse: false,
      read: false,
      archived: false,
    },
    {
      id: '2',
      from: 'citizens@townhall.gov',
      fromName: 'Citizens Coalition',
      to: 'player@townhall.gov',
      subject: 'Urgent: Public Wi-Fi Infrastructure',
      body: 'Dear Administrator, we are writing to request immediate action on improving our town\'s digital infrastructure...',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'issue',
      requiresResponse: true,
      read: false,
      archived: false,
    },
    {
      id: '3',
      from: 'finance@townhall.gov',
      fromName: 'Finance Department',
      to: 'player@townhall.gov',
      subject: 'Monthly Budget Report',
      body: 'Here is the monthly budget report showing current expenditures and revenue...',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      type: 'result',
      requiresResponse: false,
      read: true,
      archived: false,
    },
  ];

  const displayEmails = emails.length > 0 ? emails : mockEmails;

  return (
    <div className="email-list bg-white border-r border-gray-200 h-full">
      <div className="email-toolbar border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
        <p className="text-sm text-gray-500">
          {displayEmails.filter(e => !e.read).length} unread of {displayEmails.length} messages
        </p>
      </div>
      
      <div className="overflow-y-auto h-full">
        {displayEmails.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📬</div>
            <p>No emails yet</p>
            <p className="text-sm">Your inbox will populate as you play the game</p>
          </div>
        ) : (
          displayEmails.map((email) => (
            <EmailItem
              key={email.id}
              email={email}
              isSelected={selectedEmail?.id === email.id}
              onClick={() => selectEmail(email)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EmailInbox;
