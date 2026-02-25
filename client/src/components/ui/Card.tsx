import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className = '', padding = true }: CardProps) {
  return (
    <div className={`card ${className}`.trim()} style={padding ? { padding: '1.5rem' } : undefined}>
      {children}
    </div>
  );
}
