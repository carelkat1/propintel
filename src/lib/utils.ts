import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZAR(amount: number): string {
  return 'R ' + Math.round(amount).toLocaleString('en-ZA');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatRelativeTime(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\s/g, '');
  if (clean.startsWith('+27') && clean.length === 12) {
    return `+27 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  return phone;
}

export function scoreColor(score: number): string {
  if (score >= 75) return '#34C759';
  if (score >= 50) return '#FF9500';
  if (score >= 25) return '#FF9500';
  return '#FF3B30';
}

export function scoreLabel(score: number): string {
  if (score >= 75) return 'HOT';
  if (score >= 50) return 'WARM';
  if (score >= 25) return 'WATCH';
  return 'COLD';
}

export function scoreBgClass(score: number): string {
  if (score >= 75) return 'bg-accent-green/10 text-accent-green';
  if (score >= 50) return 'bg-accent-orange/10 text-accent-orange';
  return 'bg-accent-red/10 text-accent-red';
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function agentGradient(name: string): string {
  const gradients = [
    'from-blue-400 to-indigo-500',
    'from-green-400 to-teal-500',
    'from-purple-400 to-pink-500',
    'from-orange-400 to-red-500',
    'from-cyan-400 to-blue-500',
    'from-rose-400 to-purple-500',
    'from-amber-400 to-orange-500',
    'from-emerald-400 to-cyan-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

export function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function calculateCommission(salePrice: number, commissionPercent: number, splitPercent: number): { total: number; yourCut: number } {
  const total = salePrice * (commissionPercent / 100);
  const yourCut = total * (splitPercent / 100);
  return { total, yourCut };
}
