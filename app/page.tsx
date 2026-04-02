'use client';

import { TopBar } from '@/components/TopBar';
import { NoteCard } from '@/components/NoteCard';
import { useAppStore } from '@/lib/store';
import { Plus, Type, CheckSquare, Crown } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Home() {
  const { notes, viewMode, sortMode } = useAppStore();
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const router = useRouter();

  const activeNotes = notes.filter(n => !n.isTrashed && !n.isArchived);

  const sortedNotes = [...activeNotes].sort((a, b) => {
    if (sortMode === 'modified') return b.modifiedAt - a.modifiedAt;
    if (sortMode === 'created') return b.createdAt - a.createdAt;
    if (sortMode === 'alphabetical') return (a.title || '').localeCompare(b.title || '');
    if (sortMode === 'color') return a.color.localeCompare(b.color);
    return 0;
  });

  const handleAddNote = (type: 'text' | 'checklist') => {
    setIsAddMenuOpen(false);
    router.push(`/add?type=${type}`);
  };

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <TopBar />
      
      <div className={cn(
        "flex-1 overflow-y-auto pb-24",
        (viewMode === 'grid' || viewMode === 'large-grid') && "p-2 grid gap-2",
        viewMode === 'grid' && "grid-cols-3",
        viewMode === 'large-grid' && "grid-cols-2"
      )}>
        {sortedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
            <p>No notes yet.</p>
            <p className="text-sm">Tap + to add a note.</p>
          </div>
        ) : (
          sortedNotes.map(note => (
            <NoteCard key={note.id} note={note} viewMode={viewMode} />
          ))
        )}
      </div>

      {/* Add Menu Overlay */}
      {isAddMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsAddMenuOpen(false)}
        >
          <div 
            className="absolute bottom-24 right-6 bg-white rounded-lg shadow-xl overflow-hidden min-w-[160px]"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-4 py-3 text-lg font-semibold border-b border-gray-100">Add</div>
            <button 
              onClick={() => handleAddNote('text')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <Type className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Text</span>
            </button>
            <button 
              onClick={() => handleAddNote('checklist')}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-200"
            >
              <CheckSquare className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Checklist</span>
            </button>
            <button 
              onClick={() => {
                setIsAddMenuOpen(false);
                router.push('/premium');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <Crown className="w-5 h-5 text-gray-600" />
              <span className="text-gray-800">Premium</span>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsAddMenuOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-colors z-50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </main>
  );
}
