import React, { useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

const PolicyComposer: React.FC = () => {
  const { setComposing, submitPolicy, selectedEmail, isLoading } = useGameStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleClose = () => {
    setComposing(false);
    setTitle('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    await submitPolicy(title.trim(), description.trim());
    
    // Clear form and close if successful
    if (!isLoading) {
      setTitle('');
      setDescription('');
      setComposing(false);
    }
  };

  const suggestPolicyTitle = () => {
    if (selectedEmail) {
      const subject = selectedEmail.subject;
      if (subject.toLowerCase().includes('wi-fi') || subject.toLowerCase().includes('internet')) {
        setTitle('Public Wi-Fi Infrastructure Initiative');
      } else if (subject.toLowerCase().includes('budget')) {
        setTitle('Budget Allocation Adjustment');
      } else if (subject.toLowerCase().includes('housing')) {
        setTitle('Affordable Housing Development Plan');
      } else {
        setTitle(`Response to: ${subject}`);
      }
    }
  };

  const policyTemplates = [
    {
      category: 'Infrastructure',
      examples: [
        'Expand public Wi-Fi coverage throughout the town',
        'Improve road maintenance and traffic management',
        'Upgrade water and sewer systems',
      ]
    },
    {
      category: 'Economic',
      examples: [
        'Reduce business licensing fees by 10%',
        'Create small business development fund',
        'Establish public-private partnership program',
      ]
    },
    {
      category: 'Social',
      examples: [
        'Increase funding for youth programs',
        'Expand senior citizen services',
        'Create job training and placement program',
      ]
    },
    {
      category: 'Environmental',
      examples: [
        'Implement recycling incentive program',
        'Create more public green spaces',
        'Promote renewable energy adoption',
      ]
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Compose Policy Proposal</h2>
              {selectedEmail && (
                <p className="text-sm text-gray-600 mt-1">
                  In response to: "{selectedEmail.subject}"
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="sr-only">Close</span>
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Policy Title */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Policy Title
                </label>
                <button
                  type="button"
                  onClick={suggestPolicyTitle}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  💡 Suggest Title
                </button>
              </div>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input mt-1"
                placeholder="Enter a clear, descriptive title for your policy"
                maxLength={200}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/200 characters
              </p>
            </div>

            {/* Policy Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Policy Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
                className="form-textarea mt-1"
                placeholder="Describe your policy proposal in detail. Consider the impact on different demographics, budget implications, and implementation timeline."
                maxLength={2000}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Policy Templates */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">💡 Policy Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policyTemplates.map((template) => (
                  <div key={template.category} className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {template.category}
                    </h4>
                    <ul className="space-y-1">
                      {template.examples.map((example, index) => (
                        <li key={index}>
                          <button
                            type="button"
                            onClick={() => setDescription(example)}
                            className="text-xs text-left text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            • {example}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Demographic Considerations */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-700 mb-2">🎯 Consider Your Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-medium text-blue-800">Youth (18-30)</h4>
                  <p className="text-blue-700">Tech-savvy, environmentally conscious, concerned about employment and housing costs</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Business Owners</h4>
                  <p className="text-blue-700">Focused on economic growth, concerned about taxes and regulations</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Your policy will be evaluated by each demographic group
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={!title.trim() || !description.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    <span>Submit Policy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyComposer;
