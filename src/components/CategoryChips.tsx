import React from 'react';
import { ContentCategory } from '../types/tubefree';

interface CategoryChipsProps {
  selectedCategory: ContentCategory;
  onSelectCategory: (cat: ContentCategory) => void;
  isKidsMode?: boolean;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  isKidsMode,
}) => {
  const categories: { id: ContentCategory; label: string; urdu?: string }[] = isKidsMode
    ? [
        { id: 'kids', label: 'All Kids Content', urdu: 'تمام بچوں کا مواد' },
        { id: 'islamic', label: 'Islamic Stories & Naat', urdu: 'اسلامی کہانیاں' },
        { id: 'education', label: 'Learning & Quizzes', urdu: 'تعلیم' },
      ]
    : [
        { id: 'all', label: 'All', urdu: 'سب' },
        { id: 'movies', label: 'Movies (Hollywood/Lollywood)', urdu: 'فلمیں' },
        { id: 'dramas', label: 'Dramas (Pakistani & Turkish)', urdu: 'ڈرامے' },
        { id: 'islamic', label: 'Islamic (Naat, Bayan, Quran)', urdu: 'اسلامک' },
        { id: 'kids', label: 'Cartoons & Anime', urdu: 'کارٹون' },
        { id: 'sports', label: 'Sports & Cricket', urdu: 'کرکٹ' },
        { id: 'music', label: 'Music & Coke Studio', urdu: 'میوزک' },
        { id: 'education', label: 'Tech & Education', urdu: 'تعلیم' },
        { id: 'vlogs', label: 'Vlogs & Travel', urdu: 'بلاگز' },
      ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-3 md:px-6 flex items-center gap-2 select-none border-b border-gray-100 dark:border-gray-800/60 bg-white/50 dark:bg-[#0f0f0f]/50">
      {categories.map(cat => {
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isSelected
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-950 shadow-sm'
                : 'bg-gray-100 dark:bg-[#272727] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333333]'
            }`}
          >
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
