import React, { useState } from 'react';
import { VideoItem, ContentCategory } from '../types/tubefree';
import { storageService } from '../services/storageService';
import {
  X,
  Upload,
  Video,
  Sparkles,
  CheckCircle2,
  HardDrive,
  FileVideo,
} from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (video: VideoItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  onClose,
  onUploaded,
}) => {
  const [title, setTitle] = useState('');
  const [urduTitle, setUrduTitle] = useState('');
  const [category, setCategory] = useState<ContentCategory>('vlogs');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('MyVideo, Vlog, Offline');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      if (!title) {
        setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsPublishing(true);
    setTimeout(() => {
      const userChannel = storageService.getUserChannel();
      const newVideo: VideoItem = {
        id: `usr_${Date.now()}`,
        title: title.trim(),
        urduTitle: urduTitle.trim() || undefined,
        channelName: userChannel.name,
        channelAvatar: userChannel.avatar,
        subscribers: `${userChannel.subscribersCount} subs`,
        verified: true,
        views: '1 view',
        uploadDate: 'Just now',
        duration: '12:45',
        thumbnail:
          'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
        videoUrl:
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        category,
        description: description.trim() || 'Uploaded to my offline TubeFree Channel.',
        likes: 1,
        dislikes: 0,
        commentsCount: 0,
        fileSizeBytes: 180 * 1024 * 1024,
        codec: 'AV1',
        availableDubbings: ['original', 'urdu'],
        isPreloaded: false,
        tags: tags.split(',').map(t => t.trim()),
      };

      storageService.saveCustomVideo(newVideo);
      setIsPublishing(false);
      setIsSuccess(true);
      onUploaded(newVideo);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 select-none animate-fade-in backdrop-blur-sm">
      <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                TubeFree Studio • Local Upload
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Publish to your offline channel & P2P mesh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center text-center p-6 gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Video Published Locally!
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm">
              Your video has been compressed with AV1 codec and added to your TubeFree Channel. Other users can now sync it via P2P mesh.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="flex flex-col gap-3">
            {/* File Dropzone */}
            <label className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-red-500 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-[#1a1a1a] transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileVideo className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {selectedFile ? selectedFile.name : 'Select video file from device'}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5">
                MP4, MKV, WebM • Instant AV1 on-device compression
              </span>
            </label>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Video Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. My Trip to Murree Hills 2026"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Urdu Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 font-['Noto_Nastaliq_Urdu']">
                عنوان اردو میں (اختیاری)
              </label>
              <input
                type="text"
                placeholder="اردو عنوان درج کریں..."
                value={urduTitle}
                onChange={e => setUrduTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as ContentCategory)}
                  className="w-full px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="vlogs">Vlogs</option>
                  <option value="movies">Movies</option>
                  <option value="dramas">Dramas</option>
                  <option value="islamic">Islamic</option>
                  <option value="kids">Kids & Cartoons</option>
                  <option value="education">Education</option>
                  <option value="sports">Sports</option>
                  <option value="shorts">Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Codec Preset
                </label>
                <div className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 font-mono">
                  AV1 Hardware 1080p
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                placeholder="Tell viewers about your offline video..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPublishing || !title.trim()}
              className="mt-2 w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Encoding with AV1 & Saving...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish to Channel Studio</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
