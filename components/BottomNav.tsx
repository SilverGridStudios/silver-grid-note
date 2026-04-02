'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Calendar, Bell, Search, Menu, Archive, Trash2, Palette, MoreVertical, Share2, Copy, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore, NoteColor } from '@/lib/store';
import { useState } from 'react';

const colorPickerColors: NoteColor[] = [
  'red', 'orange', 'yellow',
  'green', 'blue', 'purple',
  'black', 'gray', 'white'
];

const colorMap: Record<NoteColor, string> = {
  red: 'bg-red-200',
  orange: 'bg-orange-200',
  yellow: 'bg-yellow-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
  purple: 'bg-purple-200',
  black: 'bg-gray-800 text-white',
  gray: 'bg-gray-300',
  white: 'bg-white',
};

export function BottomNav() {
  const pathname = usePathname();
  const { selectedNotes, clearSelection, bulkUpdateNotes, notes, addNote } = useAppStore();
  const [showMore, setShowMore] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const navItems = [
    { href: '/', icon: FileText, label: 'Notes' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/reminders', icon: Bell, label: 'Reminders' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/more', icon: Menu, label: 'More' },
  ];

  // Don't show bottom nav on edit pages
  if (pathname.startsWith('/edit') || pathname.startsWith('/add')) {
    return null;
  }

  if (selectedNotes.length > 0) {
    const handleDelete = () => {
      bulkUpdateNotes(selectedNotes, { isTrashed: true, modifiedAt: Date.now() });
      clearSelection();
    };
    
    const handleArchive = () => {
      bulkUpdateNotes(selectedNotes, { isArchived: true, modifiedAt: Date.now() });
      clearSelection();
    };

    const handleColorChange = (color: NoteColor) => {
      bulkUpdateNotes(selectedNotes, { color, modifiedAt: Date.now() });
      setShowColor(false);
      clearSelection();
    };

    const handleShare = async () => {
      const notesToShare = notes.filter(n => selectedNotes.includes(n.id));
      const text = notesToShare.map(n => `${n.title}\n${n.content}`).join('\n\n');
      if (typeof navigator !== 'undefined' && navigator.share) {
        try { 
          await navigator.share({ text }); 
        } catch (e) {
          console.error("Share failed", e);
          try {
            await navigator.clipboard.writeText(text);
            alert("Copied to clipboard!");
          } catch (err) {}
        }
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text);
          alert("Copied to clipboard!");
        } catch (err) {}
      } else {
        alert("Sharing not supported on this browser.");
      }
      clearSelection();
      setShowMore(false);
    };

    const handleDuplicate = () => {
      const notesToDuplicate = notes.filter(n => selectedNotes.includes(n.id));
      notesToDuplicate.forEach(note => {
        addNote({
          title: note.title ? `${note.title} (Copy)` : '',
          content: note.content,
          type: note.type,
          color: note.color,
          checklist: note.checklist,
          isLocked: note.isLocked,
        });
      });
      clearSelection();
      setShowMore(false);
    };

    const handleLock = () => {
      const notesToLock = notes.filter(n => selectedNotes.includes(n.id));
      const allLocked = notesToLock.every(n => n.isLocked);
      
      bulkUpdateNotes(selectedNotes, { isLocked: !allLocked, modifiedAt: Date.now() });
      clearSelection();
      setShowMore(false);
    };

    return (
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-gray-200 border-t border-gray-300 flex items-center justify-around px-2 z-50">
        <button onClick={handleArchive} className="flex flex-col items-center text-gray-700 w-16">
          <Archive className="w-5 h-5" />
          <span className="text-[10px] mt-1">Archive</span>
        </button>
        <button onClick={handleDelete} className="flex flex-col items-center text-gray-700 w-16">
          <Trash2 className="w-5 h-5" />
          <span className="text-[10px] mt-1">Delete</span>
        </button>
        <button onClick={() => { setShowColor(!showColor); setShowMore(false); }} className="flex flex-col items-center text-gray-700 w-16 relative">
          <Palette className="w-5 h-5" />
          <span className="text-[10px] mt-1">Color</span>
          
          {showColor && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-lg p-3 z-50 w-64 border border-gray-200">
              <div className="grid grid-cols-3 gap-2">
                {colorPickerColors.map((c) => (
                  <div
                    key={c}
                    onClick={(e) => { e.stopPropagation(); handleColorChange(c); }}
                    className={cn(
                      "aspect-square rounded-sm border-2 border-transparent transition-transform hover:scale-105",
                      colorMap[c]
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </button>
        <button className="flex flex-col items-center text-gray-700 w-16">
          <Bell className="w-5 h-5" />
          <span className="text-[10px] mt-1">Reminder</span>
        </button>
        <button onClick={() => { setShowMore(!showMore); setShowColor(false); }} className="flex flex-col items-center text-gray-700 w-16 relative">
          <MoreVertical className="w-5 h-5" />
          <span className="text-[10px] mt-1">More</span>
          
          {showMore && (
            <div className="absolute bottom-14 right-0 bg-white shadow-lg rounded-md border border-gray-200 py-2 w-48 z-50">
              <div onClick={(e) => { e.stopPropagation(); handleShare(); }} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 text-gray-700">
                <Share2 className="w-4 h-4" /> Send
              </div>
              <div onClick={(e) => { e.stopPropagation(); handleDuplicate(); }} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 text-gray-700">
                <Copy className="w-4 h-4" /> Duplicate
              </div>
              <div onClick={(e) => { e.stopPropagation(); handleLock(); }} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 text-gray-700">
                <Lock className="w-4 h-4" /> Lock
              </div>
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-gray-100 border-t border-gray-300 flex items-center justify-around px-2 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900 transition-colors",
              isActive && "text-teal-600"
            )}
          >
            <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
          </Link>
        );
      })}
    </div>
  );
}
