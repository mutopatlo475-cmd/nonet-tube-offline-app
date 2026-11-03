/**
 * P2P Mesh Sync & Franchise Super-Update Engine
 * Simulates high-speed local Wi-Fi Direct / Local hotspot offline video exchange
 */
import { P2PPeer, VideoItem } from '../types/tubefree';
import { storageService } from './storageService';

export const DISCOVERED_PEERS: P2PPeer[] = [
  {
    id: 'peer_shop_1',
    name: 'Bismillah Mobile Franchise Point (Hotspot)',
    type: 'shop_hotspot',
    distanceMeters: 4,
    signalStrength: 'Strong',
    availableVideosCount: 140,
    totalSizeGB: 45.2,
    newVideos: [
      'Tere Bin Season 2 Ep 1-4 (Mega Drama)',
      'Fighter 2026 4K Action (Bollywood)',
      'Ertugrul Ghazi Urdu HD Pack',
    ],
  },
  {
    id: 'peer_phone_1',
    name: "Usman's Galaxy S24 Ultra",
    type: 'phone',
    distanceMeters: 8,
    signalStrength: 'Strong',
    availableVideosCount: 28,
    totalSizeGB: 9.4,
    newVideos: [
      'Babar Azam Century vs Australia 2026',
      'Maaz Safder Wedding Vlog Part 2',
    ],
  },
  {
    id: 'peer_kiosk_1',
    name: 'TubeFree Super-Update Station #12 (Liberty Market)',
    type: 'kiosk',
    distanceMeters: 18,
    signalStrength: 'Medium',
    availableVideosCount: 520,
    totalSizeGB: 180.0,
    newVideos: [
      'Complete 2026 Hollywood Releases Pack (AV1)',
      'Pakistani Dramas Master Archive (70 Episodes)',
      'Kids Islamic Animated Collection',
    ],
  },
  {
    id: 'peer_phone_2',
    name: "Fatima's Redmi Note 13",
    type: 'phone',
    distanceMeters: 14,
    signalStrength: 'Medium',
    availableVideosCount: 15,
    totalSizeGB: 4.8,
    newVideos: ['Queen of Tears K-Drama Ep 1-8 Urdu Dubbed'],
  },
];

export async function simulateP2PTransfer(
  peer: P2PPeer,
  onProgress: (percent: number, speedMBps: number, transferredMB: number) => void
): Promise<VideoItem[]> {
  const totalMB = Math.min(650, peer.totalSizeGB * 120);
  const durationMs = 2800; // fast 2.8s transfer simulation
  const steps = 30;
  const interval = durationMs / steps;

  for (let i = 1; i <= steps; i++) {
    await new Promise(r => setTimeout(r, interval));
    const percent = Math.round((i / steps) * 100);
    const speedMBps = peer.type === 'kiosk' ? 125 : peer.type === 'shop_hotspot' ? 78 : 42;
    const transferredMB = Math.round((percent / 100) * totalMB);
    onProgress(percent, speedMBps, transferredMB);
  }

  // Inject a new synced video into local library
  const newSyncedVideo: VideoItem = {
    id: `p2p_sync_${Date.now()}`,
    title: `${peer.newVideos[0]} [Synced via ${peer.name}]`,
    urduTitle: 'پی ٹو پی ٹرانسفر کے ذریعے حاصل شدہ نیا مواد',
    channelName: peer.name,
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    subscribers: 'P2P Verified',
    verified: true,
    views: 'Offline Local',
    uploadDate: 'Just now (Wi-Fi Direct)',
    duration: '45:10',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    category: 'movies',
    subCategory: 'Hollywood',
    description: `Received via ultra-fast local mesh sync from ${peer.name}. 0 MB internet data used.`,
    likes: 120,
    dislikes: 0,
    commentsCount: 4,
    fileSizeBytes: totalMB * 1024 * 1024,
    codec: 'AV1',
    availableDubbings: ['original', 'urdu'],
    isPreloaded: false,
    p2pSource: peer.name,
    tags: ['P2P', 'OfflineSync', 'SuperUpdate'],
  };

  storageService.saveCustomVideo(newSyncedVideo);
  return [newSyncedVideo];
}
