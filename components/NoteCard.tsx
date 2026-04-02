import { Note, ViewMode, useAppStore } from '@/lib/store';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Lock } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  viewMode: ViewMode;
}

const colorMap: Record<Note['color'], string> = {
  red: 'bg-red-200 border-red-400',
  orange: 'bg-orange-200 border-orange-400',
  yellow: 'bg-yellow-200 border-yellow-400',
  green: 'bg-green-200 border-green-400',
  blue: 'bg-blue-200 border-blue-400',
  purple: 'bg-purple-200 border-purple-400',
  black: 'bg-gray-800 border-gray-900 text-white',
  gray: 'bg-gray-300 border-gray-400',
  white: 'bg-white border-gray-300',
};

const colorStripMap: Record<Note['color'], string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  black: 'bg-gray-900',
  gray: 'bg-gray-500',
  white: 'bg-gray-300',
};

export function NoteCard({ note, viewMode }: NoteCardProps) {
  const dateStr = format(note.modifiedAt, 'd MMM');
  const router = useRouter();
  const { selectedNotes, toggleSelection } = useAppStore();
  const isSelected = selectedNotes.includes(note.id);
  const isSelectionMode = selectedNotes.length > 0;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    timerRef.current = setTimeout(() => {
      if (!isSelectionMode) {
        toggleSelection(note.id);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleClick = (e: React.MouseEvent) => {
    cancelPress();
    if (isSelectionMode) {
      e.preventDefault();
      toggleSelection(note.id);
    } else {
      router.push(`/edit/${note.id}`);
    }
  };

  const cardProps = {
    onClick: handleClick,
    onPointerDown: startPress,
    onPointerUp: cancelPress,
    onPointerLeave: cancelPress,
    onPointerCancel: cancelPress,
    className: "block w-full cursor-pointer select-none"
  };

  const displayTitle = note.isLocked ? (note.title || 'Locked Note') : (note.title || note.content || 'Untitled');
  const displayContent = note.isLocked ? '••••••••' : note.content;
  
  if (viewMode === 'list') {
    return (
      <div {...cardProps}>
        <div className={cn(
          "flex items-center justify-between py-3 px-4 border-b border-gray-200/50 transition-all",
          colorMap[note.color],
          isSelected && "border-2 border-gray-800 shadow-md brightness-95"
        )}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={cn("w-1.5 h-8 rounded-full", colorStripMap[note.color])} />
            {note.isLocked && <Lock className="w-4 h-4 opacity-70 flex-shrink-0" />}
            <span className="text-lg truncate font-medium">{displayTitle}</span>
          </div>
          <span className="text-sm opacity-70 whitespace-nowrap ml-2">{dateStr}</span>
        </div>
      </div>
    );
  }

  if (viewMode === 'details') {
    return (
      <div {...cardProps}>
        <div className={cn(
          "flex flex-col py-3 px-4 border-b border-gray-200/50 gap-1 transition-all",
          colorMap[note.color],
          isSelected && "border-2 border-gray-800 shadow-md brightness-95"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn("w-1.5 h-5 rounded-full", colorStripMap[note.color])} />
            {note.isLocked && <Lock className="w-4 h-4 opacity-70 flex-shrink-0" />}
            <span className="text-lg truncate font-medium">{displayTitle}</span>
          </div>
          <p className="text-sm opacity-80 line-clamp-2 pl-4.5">{displayContent}</p>
          <span className="text-xs opacity-60 pl-4.5 mt-1">{dateStr}</span>
        </div>
      </div>
    );
  }

  // Grid views
  return (
    <div {...cardProps}>
      <div className={cn(
        "aspect-square p-3 flex flex-col shadow-sm border transition-all",
        colorMap[note.color],
        viewMode === 'large-grid' ? 'rounded-lg' : 'rounded-md',
        isSelected && "border-2 border-gray-800 shadow-md brightness-95"
      )}>
        <div className="flex items-center gap-1 mb-1">
          {note.isLocked && <Lock className="w-3 h-3 opacity-70 flex-shrink-0" />}
          <span className="text-sm font-medium line-clamp-2">{displayTitle}</span>
        </div>
        {viewMode === 'large-grid' && (
          <p className="text-xs opacity-80 line-clamp-3 flex-1">{displayContent}</p>
        )}
        <span className="text-xs opacity-60 mt-auto text-right">{dateStr}</span>
      </div>
    </div>
  );
}
