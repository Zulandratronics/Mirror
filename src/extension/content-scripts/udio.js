// Content script for Udio
console.log('Music Generation Downloader: Udio content script loaded');

// Track the last detected tracks to avoid sending duplicates
let lastDetectedTracks = {};

// Observe the DOM for changes
const observer = new MutationObserver(() => {
  scanForTracks();
});

// Start observing
observer.observe(document.body, { 
  childList: true, 
  subtree: true 
});

// Initial scan
scanForTracks();

// Function to scan the page for music generations
function scanForTracks() {
  // This is a simplified implementation
  // In a real extension, this would use more specific selectors based on Udio's UI
  
  // Example selector for track containers (this would need to be adjusted for the actual site)
  const trackElements = document.querySelectorAll('.audio-card, .music-item, [data-audio-id]');
  
  trackElements.forEach(el => {
    // Extract track ID from the element
    const trackId = el.dataset.audioId || el.id || generateTemporaryId(el);
    
    // Skip if we've already processed this track recently
    if (lastDetectedTracks[trackId] && 
        Date.now() - lastDetectedTracks[trackId] < 60000) {
      return;
    }
    
    // Extract track information
    const track = {
      originalId: trackId,
      platform: 'udio',
      title: extractText(el, '.track-title, .song-name, h3'),
      artist: 'AI Generated',
      description: extractText(el, '.track-description, .description, p'),
      duration: extractText(el, '.track-duration, .duration'),
      imageUrl: extractImage(el),
      downloadUrl: extractDownloadUrl(el),
      createdAt: extractDate(el)
    };
    
    // Only proceed if we have at least a title
    if (track.title) {
      // Record that we've seen this track
      lastDetectedTracks[trackId] = Date.now();
      
      // Send track to background script
      chrome.runtime.sendMessage({
        type: 'TRACK_FOUND',
        data: track
      });
    }
  });
}

// Helper functions
function extractText(element, selector) {
  const el = element.querySelector(selector);
  return el ? el.textContent.trim() : '';
}

function extractImage(element) {
  const img = element.querySelector('img');
  return img ? img.src : '';
}

function extractDownloadUrl(element) {
  const downloadBtn = element.querySelector('[download], .download-button, a[href*="download"]');
  return downloadBtn ? downloadBtn.href || '' : '';
}

function extractDate(element) {
  const dateEl = element.querySelector('.date, .timestamp, time');
  if (dateEl) {
    return dateEl.dateTime || dateEl.textContent.trim();
  }
  return new Date().toISOString();
}

function generateTemporaryId(element) {
  // Create a reasonably unique ID based on content
  const content = element.textContent.trim();
  return 'temp_' + btoa(content.substring(0, 100)).replace(/[^a-zA-Z0-9]/g, '');
}