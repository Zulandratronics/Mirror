// Background script for handling extension functionality
let tracks = [];
let settings = {
  downloadPath: 'Downloads/MusicDownloader',
  renameTemplate: '{artist} - {title}',
  fileFormat: 'mp3',
  autoDownload: true,
  notifyOnCompletion: true,
  keepHistory: true,
  maxConcurrentDownloads: 3,
  autoOrganize: true,
  tagFiles: true
};

// Store auth tokens
let authTokens = {};

// Initialize settings and auth tokens from storage
chrome.storage.sync.get(['settings', 'authTokens'], (result) => {
  if (result.settings) {
    settings = { ...settings, ...result.settings };
  }
  if (result.authTokens) {
    authTokens = result.authTokens;
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRACK_FOUND') {
    handleTrackFound(message.data, sender.tab);
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'GET_TRACKS') {
    sendResponse({ tracks });
    return true;
  }
  
  if (message.type === 'DOWNLOAD_TRACKS') {
    downloadTracks(message.trackIds || []);
    sendResponse({ success: true });
    return true;
  }
  
  if (message.type === 'GET_SETTINGS') {
    sendResponse({ settings });
    return true;
  }
  
  if (message.type === 'UPDATE_SETTINGS') {
    settings = { ...settings, ...message.settings };
    chrome.storage.sync.set({ settings });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'STORE_AUTH_TOKEN') {
    authTokens[message.platform] = message.token;
    chrome.storage.sync.set({ authTokens });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'CLEAR_AUTH') {
    delete authTokens[message.platform];
    chrome.storage.sync.set({ authTokens });
    sendResponse({ success: true });
    return true;
  }

  if (message.type === 'GET_AUTH_STATUS') {
    sendResponse({
      isAuthenticated: !!authTokens[message.platform],
      token: authTokens[message.platform]
    });
    return true;
  }
});

// Track handling
async function handleTrackFound(track, tab) {
  // Check if we're authenticated for this platform
  const token = authTokens[track.platform];
  if (!token) {
    console.log(`Not authenticated for ${track.platform}`);
    return;
  }

  // Check if track already exists
  const existingTrackIndex = tracks.findIndex(t => 
    t.platform === track.platform && t.originalId === track.originalId
  );
  
  if (existingTrackIndex >= 0) {
    // Update existing track
    tracks[existingTrackIndex] = {
      ...tracks[existingTrackIndex],
      ...track,
      lastSeen: new Date().toISOString()
    };
  } else {
    // Add new track
    tracks.push({
      ...track,
      id: generateId(),
      status: 'ready',
      discoveredAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      tabId: tab.id
    });
    
    // Auto download if enabled
    if (settings.autoDownload) {
      downloadTrack(tracks[tracks.length - 1]);
    }
  }
  
  // Notify any open popups
  chrome.runtime.sendMessage({ type: 'TRACKS_UPDATED', tracks });
}

// Download functionality
function downloadTracks(trackIds) {
  const tracksToDownload = tracks.filter(track => 
    trackIds.includes(track.id) && 
    track.status === 'ready' && 
    authTokens[track.platform]
  );
  
  tracksToDownload.forEach(track => {
    downloadTrack(track);
  });
}

async function downloadTrack(track) {
  // Mark track as downloading
  updateTrackStatus(track.id, 'downloading');
  
  try {
    // Get auth token for the platform
    const token = authTokens[track.platform];
    if (!token) {
      throw new Error(`Not authenticated for ${track.platform}`);
    }

    // Fetch the actual download URL with authentication
    const response = await fetch(track.downloadUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }

    // Start the download
    chrome.downloads.download({
      url: track.downloadUrl,
      filename: generateFilePath(track),
      headers: [
        {
          name: 'Authorization',
          value: `Bearer ${token}`
        }
      ]
    });

    updateTrackStatus(track.id, 'complete');
    
    if (settings.notifyOnCompletion) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Download Complete',
        message: `"${track.title}" has been downloaded successfully.`
      });
    }
    
    // Add to download history
    if (settings.keepHistory) {
      const historyEntry = {
        id: track.id,
        title: track.title,
        platform: track.platform,
        downloadedAt: new Date().toISOString(),
        filePath: generateFilePath(track)
      };
      
      chrome.storage.local.get({ downloadHistory: [] }, (result) => {
        const history = result.downloadHistory;
        history.push(historyEntry);
        chrome.storage.local.set({ downloadHistory: history });
      });
    }
  } catch (error) {
    console.error('Download failed:', error);
    updateTrackStatus(track.id, 'error');
    
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Download Failed',
      message: `Failed to download "${track.title}". Please try again.`
    });
  }
}

// Helper functions
function updateTrackStatus(trackId, status) {
  const trackIndex = tracks.findIndex(t => t.id === trackId);
  if (trackIndex >= 0) {
    tracks[trackIndex].status = status;
    // Notify any open popups
    chrome.runtime.sendMessage({ type: 'TRACKS_UPDATED', tracks });
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function generateFilePath(track) {
  let fileName = settings.renameTemplate
    .replace('{artist}', track.artist || 'Unknown Artist')
    .replace('{title}', track.title || 'Untitled')
    .replace('{date}', new Date().toISOString().split('T')[0]);
  
  let path = settings.downloadPath;
  
  if (settings.autoOrganize) {
    path += `/${track.platform}`;
  }
  
  return `${path}/${fileName}.${settings.fileFormat}`;
}