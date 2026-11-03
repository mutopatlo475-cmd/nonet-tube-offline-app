export type ContentCategory =
  | 'all'
  | 'movies'
  | 'dramas'
  | 'islamic'
  | 'kids'
  | 'music'
  | 'vlogs'
  | 'education'
  | 'comedy'
  | 'sports'
  | 'shorts';

export type SubCategory =
  | 'Hollywood'
  | 'Bollywood'
  | 'Lollywood'
  | 'Pakistani Drama'
  | 'Turkish Drama'
  | 'K-Drama'
  | 'Naat'
  | 'Bayan'
  | 'Tilawat'
  | 'Hamd'
  | 'Cartoons'
  | 'Anime'
  | 'Tech'
  | 'Cricket';

export type VideoQuality = '4K' | '1080p' | '720p' | 'DataSaver (360p)';

export type DubbingLanguage = 'original' | 'urdu' | 'hindi' | 'english';

export interface CommentItem {
  id: string;
  author: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface VideoItem {
  id: string;
  title: string;
  urduTitle?: string;
  channelName: string;
  channelAvatar: string;
  subscribers: string;
  verified?: boolean;
  views: string;
  uploadDate: string;
  duration: string;
  thumbnail: string;
  videoUrl: string; // HTML5 video or canvas stream
  category: ContentCategory;
  subCategory?: SubCategory;
  description: string;
  likes: number;
  dislikes: number;
  commentsCount: number;
  isShort?: boolean;
  fileSizeBytes: number; // e.g., 240 MB
  codec: 'H.265' | 'AV1';
  availableDubbings: DubbingLanguage[];
  isPreloaded: boolean;
  p2pSource?: string;
  tags: string[];
}

export interface P2PPeer {
  id: string;
  name: string;
  type: 'phone' | 'kiosk' | 'shop_hotspot';
  distanceMeters: number;
  signalStrength: 'Strong' | 'Medium' | 'Weak';
  availableVideosCount: number;
  totalSizeGB: number;
  newVideos: string[];
  isSyncing?: boolean;
}

export interface UserChannel {
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  subscribersCount: number;
  videosCount: number;
  joinedDate: string;
}

export interface StorageBreakdown {
  totalPhoneStorageGB: number;
  tubeFreeUsedGB: number;
  moviesGB: number;
  dramasGB: number;
  islamicGB: number;
  kidsGB: number;
  otherGB: number;
  compressionSavedGB: number;
}
