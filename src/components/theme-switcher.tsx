// src/components/theme-switcher.tsx
"use client"

import { useTheme } from '@/components/theme-provider';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Check } from 'lucide-react';

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <>
      {themes.map((t) => (
        <DropdownMenuItem key={t.name} onClick={() => setTheme(t.name)}>
           <div className="flex items-center justify-between w-full">
            <span>{t.label}</span>
            {theme === t.name && <Check className="h-4 w-4" />}
          </div>
        </DropdownMenuItem>
      ))}
    </>
  );
}
