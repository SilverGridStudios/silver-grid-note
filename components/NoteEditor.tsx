'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, Note, NoteColor, NoteType, ChecklistItem } from '@/lib/store';
import { Check, MoreVertical, Undo, Redo, Bell, Send, Lock, Trash2, Plus, Archive, ArrowLeft, CheckSquare, Search, Printer, Mail, MessageCircle, Twitter, Copy, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface NoteEditorProps {
  noteId?: string;
  initialType?: NoteType;
}

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

const colorPickerColors: NoteColor[] = [
  'red', 'orange', 'yellow',
  'green', 'blue', 'purple',
  'black', 'gray', 'white'
];

export function NoteEditor({ noteId, initialType = 'text' }: NoteEditorProps) {
  const router = useRouter();
  const { notes, addNote, updateNote, deleteNote } = useAppStore();
  
  const existingNote = noteId ? notes.find(n => n.id === noteId) : null;
  
  const [title, setTitle] = useState(existingNote?.title || '');
  const [content, setContent] = useState(existingNote?.content || '');
  const [color, setColor] = useState<NoteColor>(existingNote?.color || 'yellow');
  const [type, setType] = useState<NoteType>(existingNote?.type || initialType);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(existingNote?.checklist || []);
  
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(!existingNote?.isLocked);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);

  const handleSave = () => {
    if (!title.trim() && !content.trim() && checklist.length === 0) {
      router.back();
      return;
    }

    if (existingNote) {
      updateNote(existingNote.id, { title, content, color, type, checklist });
    } else {
      addNote({ title, content, color, type, checklist });
    }
    router.back();
  };

  const handleDelete = () => {
    if (existingNote) {
      deleteNote(existingNote.id);
    }
    router.back();
  };

  const addChecklistItem = () => {
    setChecklist([...checklist, { id: crypto.randomUUID(), text: '', checked: false }]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, text } : item));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleShare = async () => {
    const textToShare = `${title ? title + '\n\n' : ''}${content}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { 
        await navigator.share({ title: title || 'Note', text: textToShare }); 
        setIsMoreMenuOpen(false);
        return;
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          setIsShareSheetOpen(true);
        }
        setIsMoreMenuOpen(false);
        return;
      }
    }
    setIsShareSheetOpen(true);
    setIsMoreMenuOpen(false);
  };

  const dateStr = existingNote 
    ? format(existingNote.modifiedAt, 'dd/MM/yy h:mm a')
    : format(Date.now(), 'dd/MM/yy h:mm a');

  if (existingNote?.isLocked && !isUnlocked) {
    return (
      <div className={cn("flex flex-col h-[100dvh]", colorMap[color])}>
        <div className="flex items-center px-2 h-14 bg-black/5">
          <button onClick={() => router.back()} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          <Lock className="w-16 h-16 mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-8">Note is locked</h2>
          <button 
            onClick={() => setIsUnlocked(true)}
            className="bg-teal-600 text-white px-8 py-3 rounded-md font-medium shadow-sm"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-[100dvh]", colorMap[color])}>
      {/* Top Bar */}
      <div className="flex items-center justify-between px-1 h-14 bg-black/5">
        <button onClick={handleSave} className="p-2 hover:bg-black/10 rounded-full transition-colors shrink-0">
          <Check className="w-6 h-6" />
        </button>
        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 text-lg font-medium placeholder-black/40"
        />
        <div className="flex items-center shrink-0">
          <button onClick={handleShare} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          <button onClick={handleDelete} className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors relative"
          >
            <div className={cn("w-5 h-5 rounded-sm border border-black/20", colorMap[color])} />
          </button>
          <button 
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
          >
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Color Picker Overlay */}
      {isColorPickerOpen && (
        <div className="absolute top-14 right-12 bg-white shadow-xl rounded-lg p-3 z-50 w-64 border border-gray-200">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="font-semibold text-gray-800">Color</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {colorPickerColors.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setIsColorPickerOpen(false); }}
                className={cn(
                  "aspect-square rounded-sm border-2 transition-transform hover:scale-105",
                  colorMap[c],
                  color === c ? "border-teal-500 shadow-md" : "border-transparent"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* More Menu Overlay */}
      {isMoreMenuOpen && (
        <div className="absolute top-14 right-2 bg-white shadow-xl rounded-lg py-2 z-50 w-48 border border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700">
            <CheckSquare className="w-5 h-5" /> Check
          </button>
          <button 
            onClick={handleShare}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
          >
            <Send className="w-5 h-5" /> Send
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700">
            <Bell className="w-5 h-5" /> Reminder
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700">
            <Search className="w-5 h-5" /> Find
          </button>
          <button 
            onClick={() => {
              if (existingNote) {
                updateNote(existingNote.id, { isLocked: !existingNote.isLocked });
                setIsMoreMenuOpen(false);
                if (!existingNote.isLocked) {
                  router.back();
                }
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
          >
            <Lock className="w-5 h-5" /> {existingNote?.isLocked ? 'Unlock' : 'Lock'}
          </button>
          <button 
            onClick={() => {
              if (existingNote) {
                updateNote(existingNote.id, { isArchived: !existingNote.isArchived });
                router.back();
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
          >
            <Archive className="w-5 h-5" /> {existingNote?.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button 
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600"
          >
            <Trash2 className="w-5 h-5" /> Delete
          </button>
        </div>
      )}

      {/* Custom Share Sheet Fallback */}
      {isShareSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsShareSheetOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 flex flex-col max-h-[70vh] shadow-2xl animate-in slide-in-from-bottom-full duration-200">
            <div className="px-4 py-4 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-lg">Send to</span>
            </div>
            <div className="p-4 overflow-y-auto grid grid-cols-4 gap-y-6 gap-x-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`${title ? title + '\n\n' : ''}${content}`);
                  alert("Copied to clipboard!");
                  setIsShareSheetOpen(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Copy className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-[10px] text-center leading-tight text-gray-700">Copy to<br/>Clipboard</span>
              </button>
              
              <button 
                onClick={() => {
                  window.print();
                  setIsShareSheetOpen(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Printer className="w-6 h-6 text-gray-600" />
                </div>
                <span className="text-[10px] text-center leading-tight text-gray-700">Print</span>
              </button>

              <button 
                onClick={() => {
                  window.open(`mailto:?subject=${encodeURIComponent(title || 'Note')}&body=${encodeURIComponent(content)}`);
                  setIsShareSheetOpen(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-red-500" />
                </div>
                <span className="text-[10px] text-center leading-tight text-gray-700">Email</span>
              </button>

              <button 
                onClick={() => {
                  window.open(`https://wa.me/?text=${encodeURIComponent((title ? title + '\n\n' : '') + content)}`);
                  setIsShareSheetOpen(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <span className="text-[10px] text-center leading-tight text-gray-700">WhatsApp</span>
              </button>

              <button 
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent((title ? title + '\n\n' : '') + content)}`);
                  setIsShareSheetOpen(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-[10px] text-center leading-tight text-gray-700">Twitter</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Editor Content */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex justify-between items-center px-4 py-2 text-sm opacity-60">
          <span>{existingNote ? 'Editing' : 'New note'}</span>
          <span>{dateStr}</span>
        </div>

        {type === 'text' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none p-4 resize-none leading-relaxed text-lg"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(0,0,0,0.1) 31px, rgba(0,0,0,0.1) 32px)',
              backgroundAttachment: 'local',
              lineHeight: '32px',
              paddingTop: '6px'
            }}
          />
        ) : (
          <div className="flex-1 overflow-y-auto p-2">
            <button 
              onClick={addChecklistItem}
              className="flex items-center gap-3 p-3 w-full hover:bg-black/5 rounded-md transition-colors text-lg"
            >
              <Plus className="w-6 h-6 opacity-60" />
              <span>Add Item</span>
            </button>
            <div className="mt-2 space-y-1">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-white/40 rounded-md">
                  <input 
                    type="checkbox" 
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="w-5 h-5 rounded border-gray-400 text-teal-600 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                    className={cn(
                      "flex-1 bg-transparent border-none outline-none text-lg",
                      item.checked && "line-through opacity-50"
                    )}
                    autoFocus
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="h-12 bg-black/5 flex items-center justify-center gap-8">
        <button className="p-2 opacity-50 hover:opacity-100 transition-opacity">
          <Undo className="w-6 h-6" />
        </button>
        <button className="p-2 opacity-50 hover:opacity-100 transition-opacity">
          <Redo className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
