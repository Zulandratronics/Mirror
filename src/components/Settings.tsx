import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Save, Download, Upload, RefreshCw } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    downloadPath: 'Downloads/MusicDownloader',
    renameTemplate: '{artist} - {title}',
    fileFormat: 'mp3',
    autoDownload: true,
    notifyOnCompletion: true,
    keepHistory: true,
    maxConcurrentDownloads: 3,
    autoOrganize: true,
    tagFiles: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSave = () => {
    // In a real extension, would save to browser.storage.sync
    alert('Settings saved successfully!');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'music-downloader-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    // This would open a file picker in a real extension
    alert('This would open a file picker in the actual extension');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        downloadPath: 'Downloads/MusicDownloader',
        renameTemplate: '{artist} - {title}',
        fileFormat: 'mp3',
        autoDownload: true,
        notifyOnCompletion: true,
        keepHistory: true,
        maxConcurrentDownloads: 3,
        autoOrganize: true,
        tagFiles: true
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Settings</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Upload className="h-4 w-4" />}
            onClick={handleImport}
          >
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Download Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="downloadPath" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Download Path
                </label>
                <input
                  type="text"
                  id="downloadPath"
                  name="downloadPath"
                  value={settings.downloadPath}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white px-3 py-2 border"
                />
              </div>
              
              <div>
                <label htmlFor="renameTemplate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File Rename Template
                </label>
                <input
                  type="text"
                  id="renameTemplate"
                  name="renameTemplate"
                  value={settings.renameTemplate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white px-3 py-2 border"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Available variables: {'{artist}'}, {'{title}'}, {'{date}'}
                </p>
              </div>
              
              <div>
                <label htmlFor="fileFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preferred File Format
                </label>
                <select
                  id="fileFormat"
                  name="fileFormat"
                  value={settings.fileFormat}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white px-3 py-2 border"
                >
                  <option value="mp3">MP3</option>
                  <option value="wav">WAV</option>
                  <option value="flac">FLAC</option>
                  <option value="ogg">OGG</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="maxConcurrentDownloads" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Concurrent Downloads
                </label>
                <input
                  type="number"
                  id="maxConcurrentDownloads"
                  name="maxConcurrentDownloads"
                  min="1"
                  max="10"
                  value={settings.maxConcurrentDownloads}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white px-3 py-2 border"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Behavior Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="autoDownload"
                  name="autoDownload"
                  type="checkbox"
                  checked={settings.autoDownload}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="autoDownload" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Automatically download new generations
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="notifyOnCompletion"
                  name="notifyOnCompletion"
                  type="checkbox"
                  checked={settings.notifyOnCompletion}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="notifyOnCompletion" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show notification when download completes
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="keepHistory"
                  name="keepHistory"
                  type="checkbox"
                  checked={settings.keepHistory}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="keepHistory" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Keep download history
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="autoOrganize"
                  name="autoOrganize"
                  type="checkbox"
                  checked={settings.autoOrganize}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="autoOrganize" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Automatically organize downloads in folders by platform
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="tagFiles"
                  name="tagFiles"
                  type="checkbox"
                  checked={settings.tagFiles}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="tagFiles" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Add metadata tags to downloaded files
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 text-right">
          <Button
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleSave}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}