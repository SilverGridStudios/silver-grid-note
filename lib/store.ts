import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type NoteColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'black' | 'gray' | 'white';

export type NoteType = 'text' | 'checklist';

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  color: NoteColor;
  checklist: ChecklistItem[];
  createdAt: number;
  modifiedAt: number;
  reminderAt?: number;
  isArchived: boolean;
  isTrashed: boolean;
  isLocked?: boolean;
}

export type ViewMode = 'list' | 'details' | 'grid' | 'large-grid';
export type SortMode = 'modified' | 'created' | 'alphabetical' | 'color';

interface AppState {
  notes: Note[];
  viewMode: ViewMode;
  sortMode: SortMode;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'modifiedAt' | 'isArchived' | 'isTrashed'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortMode: (mode: SortMode) => void;
  selectedNotes: string[];
  setSelectedNotes: (ids: string[]) => void;
  clearSelection: () => void;
  toggleSelection: (id: string) => void;
  bulkUpdateNotes: (ids: string[], updates: Partial<Note>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      notes: [],
      viewMode: 'list',
      sortMode: 'modified',
      selectedNotes: [],
      setSelectedNotes: (ids) => set({ selectedNotes: ids }),
      clearSelection: () => set({ selectedNotes: [] }),
      toggleSelection: (id) => set((state) => ({
        selectedNotes: state.selectedNotes.includes(id)
          ? state.selectedNotes.filter(nId => nId !== id)
          : [...state.selectedNotes, id]
      })),
      bulkUpdateNotes: (ids, updates) => set((state) => ({
        notes: state.notes.map(note => 
          ids.includes(note.id) ? { ...note, ...updates } : note
        )
      })),
      addNote: (noteData) =>
        set((state) => ({
          notes: [
            ...state.notes,
            {
              ...noteData,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
              modifiedAt: Date.now(),
              isArchived: false,
              isTrashed: false,
            },
          ],
        })),
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, modifiedAt: Date.now() } : note
          ),
        })),
      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, isTrashed: true, modifiedAt: Date.now() } : note
          ),
        })),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSortMode: (mode) => set({ sortMode: mode }),
    }),
    {
      name: 'silver-grid-notes-storage',
    }
  )
);
