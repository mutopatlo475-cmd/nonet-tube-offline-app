/**
 * Local Storage & Persistence Service for TubeFree
 * Simulates on-device database (Hive/Isar) and AI storage trimmer
 */
import { VideoItem, CommentItem, UserChannel, StorageBreakdown } from '../types/tubefree';
import { PRELOADED_VIDEOS } from '../data/mockVideos';

const STORAGE_KEYS = {
  WATCH_HISTORY: 'tubefree_history',
  LIKED_VIDEOS: 'tubefree_liked',
  WATCH_LATER: 'tubefree_watchlater',
  SUBSCRIPTIONS: 'tubefree_subscriptions',
  CUSTOM_VIDEOS: 'tubefree_custom_videos',
  COMMENTS: 'tubefree_comments',
  USER_CHANNEL: 'tubefree_user_channel',
  KIDS_MODE: 'tubefree_kids_mode',
  PREMIUM_PASS: 'tubefree_premium_pass',
  THEME_MODE: 'tubefree_theme',
};

class StorageService {
  private initialVideos: VideoItem[] = PRELOADED_VIDEOS;

  // Retrieve all videos including user uploads and P2P synced
  public getAllVideos(): VideoItem[] {
    const custom = this.getCustomVideos();
    return [...this.initialVideos, ...custom];
  }

  public getVideoById(id: string): VideoItem | undefined {
    return this.getAllVideos().find(v => v.id === id);
  }

  // History
  public getHistory(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY);
      return data ? JSON.parse(data) : ['mov_1', 'dra_1', 'isl_1'];
    } catch {
      return [];
    }
  }

  public addToHistory(videoId: string) {
    const history = this.getHistory().filter(id => id !== videoId);
    history.unshift(videoId);
    localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(history.slice(0, 50)));
  }

  public clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
  }

  // Liked Videos
  public getLikedVideos(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKED_VIDEOS);
      return data ? JSON.parse(data) : ['mov_1', 'isl_1', 'spo_1'];
    } catch {
      return [];
    }
  }

  public toggleLike(videoId: string): boolean {
    const liked = this.getLikedVideos();
    const index = liked.indexOf(videoId);
    let isLiked = false;
    if (index >= 0) {
      liked.splice(index, 1);
      isLiked = false;
    } else {
      liked.unshift(videoId);
      isLiked = true;
    }
    localStorage.setItem(STORAGE_KEYS.LIKED_VIDEOS, JSON.stringify(liked));
    return isLiked;
  }

  // Watch Later
  public getWatchLater(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCH_LATER);
      return data ? JSON.parse(data) : ['mov_2', 'dra_2'];
    } catch {
      return [];
    }
  }

  public toggleWatchLater(videoId: string): boolean {
    const list = this.getWatchLater();
    const index = list.indexOf(videoId);
    let isSaved = false;
    if (index >= 0) {
      list.splice(index, 1);
      isSaved = false;
    } else {
      list.unshift(videoId);
      isSaved = true;
    }
    localStorage.setItem(STORAGE_KEYS.WATCH_LATER, JSON.stringify(list));
    return isSaved;
  }

  // Subscriptions
  public getSubscriptions(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      return data ? JSON.parse(data) : ['Geo Films Official', 'ARY Digital HD', 'Qari Mishary Rashid Alafasy'];
    } catch {
      return [];
    }
  }

  public toggleSubscription(channelName: string): boolean {
    const subs = this.getSubscriptions();
    const index = subs.indexOf(channelName);
    let isSubscribed = false;
    if (index >= 0) {
      subs.splice(index, 1);
      isSubscribed = false;
    } else {
      subs.push(channelName);
      isSubscribed = true;
    }
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subs));
    return isSubscribed;
  }

  // Custom User Uploaded Videos (Channel studio)
  public getCustomVideos(): VideoItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_VIDEOS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveCustomVideo(video: VideoItem) {
    const list = this.getCustomVideos();
    list.unshift(video);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VIDEOS, JSON.stringify(list));
  }

  // Comments
  public getComments(videoId: string): CommentItem[] {
    try {
      const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
      const base: CommentItem[] = [
        {
          id: 'c1',
          author: 'Hamza Malik',
          authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80',
          text: 'Super quality offline! Saved all my mobile data in village. Thank you TubeFree!',
          timestamp: '2 hours ago',
          likes: 42,
        },
        {
          id: 'c2',
          author: 'Ayesha Khan',
          authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
          text: 'The Urdu AI dubbing is so natural! Feels like original audio.',
          timestamp: '1 day ago',
          likes: 89,
        },
      ];
      return [...(allComments[videoId] || []), ...base];
    } catch {
      return [];
    }
  }

  public addComment(videoId: string, comment: CommentItem) {
    try {
      const allComments = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMMENTS) || '{}');
      if (!allComments[videoId]) allComments[videoId] = [];
      allComments[videoId].unshift(comment);
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(allComments));
    } catch {
      // Ignored
    }
  }

  // User Channel Profile
  public getUserChannel(): UserChannel {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_CHANNEL);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return {
      name: 'Mohammad Ali',
      handle: '@ali_creator_pk',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
      subscribersCount: 1420,
      videosCount: 3,
      joinedDate: 'Jan 2026',
    };
  }

  // Kids Mode State
  public isKidsMode(): boolean {
    return localStorage.getItem(STORAGE_KEYS.KIDS_MODE) === 'true';
  }

  public setKidsMode(enabled: boolean) {
    localStorage.setItem(STORAGE_KEYS.KIDS_MODE, enabled ? 'true' : 'false');
  }

  // Premium Pass
  public isPremium(): boolean {
    return localStorage.getItem(STORAGE_KEYS.PREMIUM_PASS) === 'true';
  }

  public setPremium(active: boolean) {
    localStorage.setItem(STORAGE_KEYS.PREMIUM_PASS, active ? 'true' : 'false');
  }

  // AI Smart Storage Calculation
  public getStorageBreakdown(): StorageBreakdown {
    return {
      totalPhoneStorageGB: 64.0,
      tubeFreeUsedGB: 14.8,
      moviesGB: 5.9,
      dramasGB: 3.8,
      islamicGB: 2.1,
      kidsGB: 1.8,
      otherGB: 1.2,
      compressionSavedGB: 28.4, // H.265 / AV1 saved 68% space
    };
  }

  // AI Auto-Trimmer simulation
  public runAiSmartStorageOptimization(): { freedGB: number; preservedCount: number } {
    return {
      freedGB: 3.4,
      preservedCount: 18,
    };
  }
}

export const storageService = new StorageService();
