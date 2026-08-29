import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  accentClass: string;
}

export function StatusCard({ title, value, icon: Icon, colorClass, accentClass }: StatusCardProps) {
  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 border-l-4 ${accentClass} flex items-center gap-4`}>
      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 font-medium truncate">{title}</p>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}
