'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import type { PlaceItem } from '@/app/api/search/places/route';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (name: string, address: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CourseSearchInput({ value, onChange, onSelect, placeholder, className }: Props) {
  const [items, setItems] = useState<PlaceItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) { setItems([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search/places?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setOpen(true);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value, search]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(item: PlaceItem) {
    onSelect(item.title, item.roadAddress || item.address);
    setOpen(false);
    setItems([]);
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => items.length > 0 && setOpen(true)}
          placeholder={placeholder ?? '골프장 이름을 입력하세요'}
          className={className}
        />
        {loading && (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
        )}
      </div>

      {open && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {items.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[var(--gray-400)]">검색 결과가 없습니다.</li>
          ) : (
            items.map((item, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-[var(--primary-500)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-[var(--gray-900)]">{item.title}</p>
                      <p className="text-xs text-[var(--gray-400)] mt-0.5">
                        {item.roadAddress || item.address}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
