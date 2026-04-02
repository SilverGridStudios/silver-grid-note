'use client';

import { LayoutGrid, MoreVertical, List, Grid, LayoutList, X, CheckSquare } from 'lucide-react';
import { useAppStore, ViewMode } from '@/lib/store';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function TopBar() {
  const { notes, viewMode, setViewMode, sortMode, setSortMode, selectedNotes, clearSelection, setSelectedNotes } = useAppStore();
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);

  const activeNotes = notes.filter(n => !n.isTrashed && !n.isArchived);

  const viewIcons: Record<ViewMode, React.ReactNode> = {
    'list': <List className="w-5 h-5" />,
    'details': <LayoutList className="w-5 h-5" />,
    'grid': <Grid className="w-5 h-5" />,
    'large-grid': <LayoutGrid className="w-5 h-5" />
  };

  if (selectedNotes.length > 0) {
    return (
      <div className="flex flex-col bg-gray-200 shadow-sm z-40 relative">
        <div className="flex items-center px-4 h-14 gap-4">
          <button onClick={clearSelection} className="p-2 hover:bg-gray-300 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-700" />
          </button>
          <span className="text-xl font-semibold text-gray-800">
            {selectedNotes.length}/{activeNotes.length}
          </span>
          <div className="flex-1" />
          <button 
            onClick={() => {
              if (selectedNotes.length === activeNotes.length) {
                clearSelection();
              } else {
                setSelectedNotes(activeNotes.map(n => n.id));
              }
            }}
            className="p-2 hover:bg-gray-300 rounded-full transition-colors"
          >
            <CheckSquare className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="border-t border-gray-300 bg-gray-200 h-8 flex items-center justify-center">
          <span className="text-sm text-gray-700 font-medium">Sort by modified time</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 shadow-sm z-40 relative">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="text-xl font-semibold text-gray-700 flex items-center gap-1">
          <span className="text-gray-500 font-light">Silver</span>
          <span>Note</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            {viewIcons[viewMode]}
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* View Menu Dropdown */}
      {isViewMenuOpen && (
        <div className="absolute top-12 right-12 bg-white shadow-lg rounded-md border border-gray-200 py-2 w-48 z-50">
          <div className="px-4 py-2 text-sm font-semibold text-gray-800 border-b border-gray-100">View</div>
          {(['list', 'details', 'grid', 'large-grid'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                setIsViewMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <div className="text-gray-600">{viewIcons[mode]}</div>
              <span className="capitalize text-gray-700">{mode.replace('-', ' ')}</span>
            </button>
          ))}
        </div>
      )}

      {/* Sort Bar */}
      <div className="border-t border-gray-300 bg-gray-200 h-8 flex items-center justify-center">
        <select 
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value as any)}
          className="bg-transparent text-sm text-gray-700 font-medium outline-none cursor-pointer"
        >
          <option value="modified">Sort by modified time</option>
          <option value="created">Sort by created time</option>
          <option value="alphabetical">Sort alphabetically</option>
          <option value="color">Sort by color</option>
        </select>
      </div>
    </div>
  );
}
