import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Check, ExternalLink, LogIn } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  authUrl: string;
}

interface PlatformCardProps {
  platform: Platform;
}

export function PlatformCard({ platform }: PlatformCardProps) {
  const [isConnected, setIsConnected] = useState(platform.connected);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Open platform's auth page in a new window
      const authWindow = window.open(
        platform.authUrl,
        `${platform.name} Login`,
        'width=600,height=700'
      );

      // Listen for auth completion message
      window.addEventListener('message', (event) => {
        if (event.data.type === 'AUTH_COMPLETE' && event.data.platform === platform.id) {
          setIsConnected(true);
          authWindow?.close();
        }
      }, { once: true });
    } catch (error) {
      console.error('Authentication failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Send message to background script to clear auth tokens
      await chrome.runtime.sendMessage({
        type: 'CLEAR_AUTH',
        platform: platform.id
      });
      setIsConnected(false);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
          {isConnected && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
              <Check className="h-3 w-3 mr-1" /> Connected
            </span>
          )}
        </div>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{platform.description}</p>
        
        <div className="mt-4 flex space-x-2">
          {isConnected ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
              >
                Disconnect
              </Button>
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ExternalLink className="h-4 w-4" />}
                onClick={() => window.open(platform.authUrl, '_blank')}
              >
                Open {platform.name}
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="sm"
              leftIcon={<LogIn className="h-4 w-4" />}
              isLoading={isConnecting}
              onClick={handleConnect}
            >
              Sign in to {platform.name}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}