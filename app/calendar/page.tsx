'use client';

import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { notes } = useAppStore();
  const router = useRouter();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 bg-gray-100 shadow-sm z-10">
        <div className="text-xl font-semibold text-gray-700">Calendar</div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <span className="text-gray-600">Today</span>
          </button>
        </div>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 border-b border-gray-300">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-300 rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium text-lg">{format(currentDate, 'MMMM yyyy')}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-300 rounded-full">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {weekDays.map((day, i) => (
            <div 
              key={day} 
              className={cn(
                "py-2 text-center text-xs font-semibold",
                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"
              )}
            >
              {day}
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-6">
          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            
            // Find notes for this day
            const dayNotes = notes.filter(n => !n.isTrashed && !n.isArchived && isSameDay(new Date(n.modifiedAt), day));

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "border-b border-r border-gray-100 p-1 flex flex-col relative",
                  !isCurrentMonth && "bg-gray-50/50",
                  isToday && "border-2 border-blue-400 z-10"
                )}
              >
                <span className={cn(
                  "text-sm",
                  !isCurrentMonth ? "text-gray-400" : 
                  day.getDay() === 0 ? "text-red-500" : 
                  day.getDay() === 6 ? "text-blue-500" : "text-gray-700"
                )}>
                  {format(day, dateFormat)}
                </span>
                
                <div className="flex-1 mt-1 flex flex-col gap-1 overflow-hidden">
                  {dayNotes.slice(0, 3).map(note => (
                    <div 
                      key={note.id}
                      className={cn(
                        "w-full h-1.5 rounded-full",
                        note.color === 'red' ? 'bg-red-400' :
                        note.color === 'orange' ? 'bg-orange-400' :
                        note.color === 'yellow' ? 'bg-yellow-400' :
                        note.color === 'green' ? 'bg-green-400' :
                        note.color === 'blue' ? 'bg-blue-400' :
                        note.color === 'purple' ? 'bg-purple-400' :
                        note.color === 'black' ? 'bg-gray-800' :
                        note.color === 'gray' ? 'bg-gray-400' : 'bg-gray-200 border border-gray-300'
                      )}
                    />
                  ))}
                  {dayNotes.length > 3 && (
                    <div className="text-[10px] text-gray-400 leading-none">+{dayNotes.length - 3}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push('/add')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-700 transition-colors z-50"
      >
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
