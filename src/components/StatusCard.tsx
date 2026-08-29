import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
}

export function StatusCard({ title, value, icon: Icon, colorClass }: StatusCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-4 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
