'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';

interface PhotoUploaderProps {
  value: string[];           // 현재 저장된 URL 목록
  onChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({
  value,
  onChange,
  maxPhotos = 10,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const remaining = maxPhotos - value.length;
    const selected = Array.from(files).slice(0, remaining);

    setIsUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      selected.forEach((f) => fd.append('files', f));

      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? '업로드 실패');
      onChange([...value, ...data.urls]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removePhoto(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  return (
    <div className="flex flex-col gap-2">
      {/* 썸네일 목록 */}
      {value.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {value.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img src={url} alt="업로드된 사진" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(url)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X size={10} className="text-white" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 추가 버튼 */}
      {value.length < maxPhotos && (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 h-12 px-4 rounded-xl border-2 border-dashed border-gray-200 text-sm text-[var(--gray-500)] hover:border-[var(--primary-500)] hover:text-[var(--primary-500)] transition-colors disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ImagePlus size={18} />
          )}
          <span>
            {isUploading
              ? '업로드 중...'
              : `사진 추가 (${value.length}/${maxPhotos})`}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="text-xs text-[var(--error)]">{error}</p>}
    </div>
  );
}
