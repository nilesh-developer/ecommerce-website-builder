import React, { useState } from 'react';

const Tags = ({tags, setTags}) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      if (!tags.includes(input)) {
        setTags([...tags, input]);
        setInput('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="lg:py-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
      <p className="text-gray-600 mb-4">Utilize tags to categorize your products and enhance searchability.</p>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="tags">
          Tags
        </label>
        <div className="relative">
          <input
            type="text"
            id="tags"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search or create tags"
            className="w-full px-3 py-2 bg-transparent border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(index)}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tags;
