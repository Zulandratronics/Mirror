import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Trash, Play, Download, Search, Filter, Music2 } from 'lucide-react';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  // Mock download history for demo purposes
  const downloadHistory = [
    { id: '1', title: 'Summer Breeze', platform: 'suno', date: '2025-05-10T15:30:00Z', size: '8.4 MB' },
    { id: '2', title: 'Neon Dreams', platform: 'suno', date: '2025-05-09T12:15:00Z', size: '7.2 MB' },
    { id: '3', title: 'Midnight Jazz', platform: 'udio', date: '2025-05-08T22:45:00Z', size: '9.1 MB' },
    { id: '4', title: 'Urban Echoes', platform: 'udio', date: '2025-05-07T18:20:00Z', size: '6.8 MB' },
  ];

  const filteredHistory = downloadHistory
    .filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'platform') {
        return a.platform.localeCompare(b.platform);
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold">Download History</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search downloads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="platform">Sort by Platform</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center">
                    <Music2 className="h-10 w-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 space-x-3">
                        <span className="capitalize">{item.platform}</span>
                        <span>•</span>
                        <span>{new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 self-end sm:self-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Play className="h-4 w-4" />}
                      aria-label={`Play ${item.title}`}
                    >
                      Play
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="h-4 w-4" />}
                      aria-label={`Download ${item.title}`}
                    >
                      Download Again
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash className="h-4 w-4 text-red-500" />}
                      aria-label={`Delete ${item.title} from history`}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <Download className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No download history found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                No results match your search criteria
              </p>
            )}
          </div>
        )}
      </div>
      
      {filteredHistory.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredHistory.length} of {downloadHistory.length} downloads
          </p>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Trash className="h-4 w-4" />}
          >
            Clear History
          </Button>
        </div>
      )}
    </div>
  );
}