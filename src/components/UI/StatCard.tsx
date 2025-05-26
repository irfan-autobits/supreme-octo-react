// project/src/components/UI/StatCard.tsx
import { ReactNode } from 'react';

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function Card({ className, children, ...props }: { className?: string; children: ReactNode }) {
  return <div className={cn('rounded-2xl border bg-white text-black shadow-sm', className)} {...props}>{children}</div>;
}

export function CardHeader({ className, children, ...props }: { className?: string; children: ReactNode }) {
  return <div className={cn('border-b p-4', className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }: { className?: string; children: ReactNode }) {
  return <h3 className={cn('text-xl font-semibold', className)} {...props}>{children}</h3>;
}

export function CardContent({ className, children, ...props }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-4', className)} {...props}>{children}</div>;
}