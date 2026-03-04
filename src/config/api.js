// API endpoints for Cloudflare Workers
export const API_CONFIG = {
  DISCOVER_WORKER: 'https://quantum-discover.quantumscienceai.workers.dev',
  CHAT_WORKER: 'https://quantum-chat.quantumscienceai.workers.dev',
  MEDIA_WORKER: 'https://quantum-media.quantumscienceai.workers.dev',
};

// Fetch papers feed
export const fetchPapersFeed = async () => {
  try {
    const response = await fetch(`${API_CONFIG.DISCOVER_WORKER}/feed`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Feed fetch error:', error);
    throw error;
  }
};

// Search papers
export const searchPapers = async (query) => {
  try {
    const response = await fetch(
      `${API_CONFIG.DISCOVER_WORKER}/search?q=${encodeURIComponent(query)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Send chat message (streaming) — text/code/general
export const sendChatMessage = async (messages, userId, onChunk, onComplete) => {
  try {
    const response = await fetch(`${API_CONFIG.CHAT_WORKER}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userId, stream: true }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('text/event-stream')) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';
      let metadata = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'meta') {
                metadata = JSON.parse(data.data);
              } else if (data.type === 'chunk') {
                fullText += data.text;
                onChunk(data.text);
              } else if (data.type === 'done') {
                onComplete(fullText, metadata);
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } else {
      const data = await response.json();
      onComplete(data.response, {
        image: data.image,
        video: data.video,
        remaining: data.remaining,
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

// Send media message (images & videos) — uses dedicated media worker
export const sendMediaMessage = async (messages, userId, onComplete) => {
  try {
    const response = await fetch(`${API_CONFIG.MEDIA_WORKER}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    onComplete(data.response, {
      images: data.images || [],
      videos: data.videos || [],
      remaining: data.remaining,
    });
  } catch (error) {
    console.error('Media error:', error);
    throw error;
  }
};
