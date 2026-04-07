import { Session } from '../utils/session';

const BASE_URL = 'https://api.hellothematic.com/api/v2';

async function getHeaders() {
  const token = await Session.getAuthToken();
  const teamId = await Session.getTeamId();
  const channelId = await Session.getChannelId();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(teamId ? { 'X-Team-ID': teamId } : {}),
    ...(channelId ? { 'X-Channel-ID': channelId } : {}),
  };
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as any) },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export const ThematicAPI = {
  getProject: (projectId: string) =>
    apiFetch(`/projects/${projectId}`),

  updateProject: (projectId: string, data: { name?: string; description?: string }) =>
    apiFetch(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSongs: (projectId: string, page = 1, limit = 15) =>
    apiFetch(`/projects/${projectId}/songs?page=${page}&limit=${limit}`),

  deleteSong: (projectId: string, songId: string) =>
    apiFetch(`/projects/${projectId}/songs`, {
      method: 'DELETE',
      body: JSON.stringify({ song_id: songId }),
    }),

  getPickups: (projectId: string) =>
    apiFetch(`/projects/${projectId}/pickups`),
};

export const MOCK_DATA = {
  playlists: [
    { id: '1', name: 'Chill Vibes', description: 'Relaxing beats for your content', songCount: 24, cover: null, color: '#7C5CFC' },
    { id: '2', name: 'Epic Cinematic', description: 'Big orchestral moments', songCount: 18, cover: null, color: '#FC5C7D' },
    { id: '3', name: 'Lo-Fi Study', description: 'Focus and productivity', songCount: 32, cover: null, color: '#5CF4C8' },
    { id: '4', name: 'Summer Vibes', description: 'Bright and energetic tracks', songCount: 15, cover: null, color: '#FFD166' },
    { id: '5', name: 'Dark Ambient', description: 'Moody atmospheric sounds', songCount: 20, cover: null, color: '#5B3FD4' },
  ],
  songs: Array.from({ length: 20 }, (_, i) => ({
    id: `song_${i + 1}`,
    title: ['Midnight Drive', 'Solar Winds', 'Neon Rain', 'Crystal Clear', 'Deep Space', 'Urban Flow', 'Sunset Boulevard', 'Electric Dreams', 'Ocean Waves', 'Mountain High', 'City Lights', 'Forest Walk', 'Desert Storm', 'Arctic Chill', 'Jungle Beat', 'Stargazing', 'River Flow', 'Thunder Road', 'Calm Waters', 'Fire Dance'][i],
    artist: ['Luna Park', 'The Cosmos', 'NightOwl', 'Echo State', 'Drift Mode', 'Urban Poet', 'Mellow Sky', 'Wave Rider', 'Sol Rising', 'Frost Bite'][i % 10],
    duration: `${2 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    genre: ['Chill', 'Electronic', 'Lo-Fi', 'Cinematic', 'Pop'][i % 5],
    bpm: 80 + Math.floor(Math.random() * 80),
    color: ['#7C5CFC', '#FC5C7D', '#5CF4C8', '#FFD166', '#5B3FD4'][i % 5],
  })),
  pickups: Array.from({ length: 5 }, (_, i) => ({
    id: `pickup_${i + 1}`,
    title: ['Midnight Drive', 'Solar Winds', 'Neon Rain', 'Crystal Clear', 'Deep Space'][i],
    artist: ['Luna Park', 'The Cosmos', 'NightOwl', 'Echo State', 'Drift Mode'][i],
    pickedAt: new Date(Date.now() - i * 86400000).toISOString(),
    color: ['#7C5CFC', '#FC5C7D', '#5CF4C8', '#FFD166', '#5B3FD4'][i],
  })),
};
