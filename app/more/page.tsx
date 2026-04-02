'use client';

import { useAppStore } from '@/lib/store';
import { Archive, Trash2, Settings, HelpCircle, Info, Cloud, Palette } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MorePage() {
  const router = useRouter();
  const { notes } = useAppStore();

  const trashedCount = notes.filter(n => n.isTrashed).length;
  const archivedCount = notes.filter(n => n.isArchived && !n.isTrashed).length;

  const menuItems = [
    { icon: Archive, label: 'Archive', count: archivedCount, href: '/archive' },
    { icon: Trash2, label: 'Trash Can', count: trashedCount, href: '/trash' },
    { icon: Palette, label: 'Theme', href: '/theme' },
    { icon: Cloud, label: 'Sync', href: '/sync' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help', href: '/help' },
    { icon: Info, label: 'About', href: '/about' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center px-4 h-14 bg-gray-100 shadow-sm z-10">
        <div className="text-xl font-semibold text-gray-700">More</div>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto pt-2">
        <div className="bg-white border-y border-gray-200">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-none"
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-6 h-6 text-gray-500" />
                  <span className="text-lg text-gray-800">{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
