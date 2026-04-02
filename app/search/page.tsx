'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { NoteCard } from '@/components/NoteCard';
import { Search as SearchIcon, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { notes, viewMode } = useAppStore();
  const router = useRouter();

  const activeNotes = notes.filter(n => !n.isTrashed && !n.isArchived);
  
  const searchResults = query.trim() === '' 
    ? [] 
    : activeNotes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) || 
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.checklist.some(item => item.text.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Search Header */}
      <div className="flex items-center gap-2 px-2 h-14 bg-white shadow-sm z-10">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div className="flex-1 flex items-center bg-gray-100 rounded-md px-3 py-1.5">
          <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
            className="flex-1 bg-transparent border-none outline-none text-gray-800"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-2">
        {query.trim() !== '' && searchResults.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No results found for "{query}"
          </div>
        ) : (
          <div className="grid gap-2">
            {searchResults.map(note => (
              <NoteCard key={note.id} note={note} viewMode="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
