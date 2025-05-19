import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/Tabs';
import Navbar from './components/Navbar';
import DownloadManager from './components/DownloadManager';
import Settings from './components/Settings';
import History from './components/History';
import { Download, Cog, Clock, Music } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('downloads');

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-700 dark:text-indigo-400">
          Music Generation Downloader
        </h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="downloads" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Downloads</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="downloads" className="space-y-6">
            <DownloadManager />
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <History />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        © 2025 Music Generation Downloader
      </footer>
    </div>
  );
}

export default App;