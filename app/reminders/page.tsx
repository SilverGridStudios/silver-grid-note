'use client';

import { useAppStore } from '@/lib/store';
import { NoteCard } from '@/components/NoteCard';
import { Bell } from 'lucide-react';

export default function RemindersPage() {
  const { notes, viewMode } = useAppStore();

  const reminderNotes = notes.filter(n => !n.isTrashed && !n.isArchived && n.reminderAt);

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center px-4 h-14 bg-gray-100 shadow-sm z-10">
        <div className="text-xl font-semibold text-gray-700">Reminders</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        {reminderNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
            <Bell className="w-16 h-16 mb-4 opacity-20" />
            <p>No reminders set.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {reminderNotes.map(note => (
              <NoteCard key={note.id} note={note} viewMode="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
