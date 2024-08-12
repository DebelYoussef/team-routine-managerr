// components/SearchBar.tsx
import React from 'react';

const SearchBar: React.FC = () => {
  return (
    <div className="flex items-center p-4 bg-transparent shadow-md w-auto">
      <input
        type="text"
        placeholder="Search here..."
        className="w-full p-2 border rounded-xl"
      />
    </div>
  );
};

export default SearchBar;
