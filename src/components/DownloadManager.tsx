import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Download, Plus, Check, X, Trash, Music2 } from 'lucide-react';
import { PlatformCard } from './PlatformCard';

const platforms = [
  { 
    id: 'suno', 
    name: 'Suno', 
    description: 'Download your AI-generated music from Suno.',
    connected: false,
    authUrl: 'https://app.suno.ai/auth' 
  },
  { 
    id: 'udio', 
    name: 'Udio', 
    description: 'Download your music generations from Udio.',
    connected: false,
    authUrl: 'https://udio.com/login'
  }
];

export default function DownloadManager() {
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloads, setDownloads] = useState<any[]>([]);
  
  // Mock tracks for demo purposes
  const availableTracks = [
    { id: '1', title: 'Summer Breeze', platform: 'suno', date: '2025-05-10', status: 'ready' },
    { id: '2', title: 'Neon Dreams', platform: 'suno', date: '2025-05-09', status: 'ready' },
    { id: '3', title: 'Midnight Jazz', platform: 'udio', date: '2025-05-08', status: 'processing' },
    { id: '4', title: 'Urban Echoes', platform: 'udio', date: '2025-05-07', status: 'ready' },
  ];

  const handleSelectTrack = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTracks.length === availableTracks.length) {
      setSelectedTracks([]);
    } else {
      setSelectedTracks(availableTracks.map(track => track.id));
    }
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      const newDownloads = selectedTracks.map(trackId => {
        const track = availableTracks.find(t => t.id === trackId);
        return {
          id: trackId,
          title: track?.title,
          platform: track?.platform,
          date: new Date().toISOString(),
          status: 'complete'
        };
      });
      
      setDownloads([...downloads, ...newDownloads]);
      setSelectedTracks([]);
      setIsDownloading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-2 gap-4">
        <h2 className="text-xl font-semibold col-span-full mb-2">Platforms</h2>
        {platforms.map(platform => (
          <PlatformCard key={platform.id} platform={platform} />
        ))}
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Tracks</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedTracks.length === availableTracks.length ? 'Deselect All' : 'Select All'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="h-4 w-4" />}
              isLoading={isDownloading}
              disabled={selectedTracks.length === 0}
              onClick={handleDownload}
            >
              Download Selected
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                    checked={selectedTracks.length === availableTracks.length && availableTracks.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {availableTracks.map((track) => (
                <tr 
                  key={track.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedTracks.includes(track.id) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                      checked={selectedTracks.includes(track.id)}
                      onChange={() => handleSelectTrack(track.id)}
                      disabled={track.status === 'processing'}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Music2 className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900 dark:text-white">{track.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                      {track.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {track.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {track.status === 'ready' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        <Check className="h-3 w-3 mr-1" /> Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                        <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {availableTracks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No tracks available. Connect to a platform to see your music generations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Active Downloads</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {downloads.length > 0 ? (
            <div className="space-y-4">
              {downloads.map((download, index) => (
                <div 
                  key={`${download.id}-${index}`} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center">
                    <Music2 className="h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="font-medium">{download.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {download.platform} • {new Date(download.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500 flex items-center">
                      <Check className="h-4 w-4 mr-1" /> Complete
                    </span>
                    <Button variant="ghost" size="sm" leftIcon={<Trash className="h-4 w-4" />}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Download className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No active downloads</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Select tracks from the available tracks section to start downloading
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}