'use client';

import { useAppStore } from '@/lib/store';
import { NoteCard } from '@/components/NoteCard';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TrashPage() {
  const { notes } = useAppStore();
  const router = useRouter();

  const trashedNotes = notes.filter(n => n.isTrashed);

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center gap-2 px-2 h-14 bg-gray-100 shadow-sm z-10">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="text-xl font-semibold text-gray-700">Trash Can</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {trashedNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
            <Trash2 className="w-16 h-16 mb-4 opacity-20" />
            <p>Trash is empty.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {trashedNotes.map(note => (
              <NoteCard key={note.id} note={note} viewMode="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
