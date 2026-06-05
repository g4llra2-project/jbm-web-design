import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  currentValue: string;
  onChange: (value: string) => void;
  presetOptions?: { label: string; url: string }[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentValue,
  onChange,
  presetOptions = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Responsive client-side image compression using canvas
  const processAndCompressFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('File harus berupa gambar (PNG, JPG, WebP, dll)');
      return;
    }

    setCompressing(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Set maximum dimension
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed output
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
          onChange(compressedDataUrl);
        } else {
          // Fallback if canvas context fails
          onChange(event.target?.result as string);
        }
        setCompressing(false);
      };
      
      img.onerror = () => {
        setErrorMessage('Gagal memuat gambar');
        setCompressing(false);
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      setErrorMessage('Gagal membaca file');
      setCompressing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processAndCompressFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processAndCompressFile(files[0]);
    }
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isBase64 = currentValue && currentValue.startsWith('data:image/');
  const hasValue = !!currentValue;

  return (
    <div className="space-y-2 text-left" id={`uploader_${label.replace(/\s+/g, '_')}`}>
      <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">
        {label}
      </label>

      {/* Main Drag-n-Drop Container Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[110px] bg-[#0c1324] ${
          isDragging 
            ? 'border-accent-red bg-[#1a1421]' 
            : hasValue 
              ? 'border-white/10 hover:border-white/20' 
              : 'border-white/20 hover:border-accent-red/70'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {compressing ? (
          <div className="space-y-1.5 py-4">
            <div className="w-5 h-5 border-2 border-accent-red border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Memproses & Kompresi Gambar...</p>
          </div>
        ) : hasValue ? (
          <div className="w-full flex items-center gap-3 relative group text-left" onClick={(e) => e.stopPropagation()}>
            {/* Miniature thumbnail preview */}
            <div className="w-16 h-12 rounded bg-navy-deep relative flex-shrink-0 border border-white/15 overflow-hidden">
              <img
                src={currentValue}
                alt="Uploaded source scale"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="min-w-0 flex-1">
              <div className="text-[9.5px] font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1">
                <span className="text-emerald-500">●</span> Gambar Siap Digunakan
              </div>
              <p className="text-[8px] font-mono text-gray-500 truncate mt-0.5" title={currentValue}>
                {isBase64 ? 'Format: Base64 URI (Compressed JPEG)' : currentValue}
              </p>
            </div>

            {/* Clear button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="p-1 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded cursor-pointer self-center"
              title="Ganti Gambar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5 py-1 pointer-events-none">
            <Upload className="w-5 h-5 text-gray-500 mx-auto group-hover:text-amber-500" />
            <div className="text-[9px] font-sans font-bold text-gray-300 uppercase tracking-wider">
              Tarik & Lepas File di Sini atau <span className="text-[#D4A017] underline">Pilih File</span>
            </div>
            <p className="text-[7.5px] font-mono text-gray-500 uppercase tracking-widest">
              JPG, PNG, WEBP (Maks 10MB • Auto-Kompres Ke Sektor Ringan)
            </p>
          </div>
        )}
      </div>

      {/* Error prompt */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 bg-red-950/40 text-red-400 border border-red-500/10 p-1.5 rounded text-[9px] font-mono">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>ERROR JBM: {errorMessage}</span>
        </div>
      )}

      {/* Alternative pasting input option */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={isBase64 ? '' : currentValue}
            placeholder={isBase64 ? 'Atau paste URL Baru jika tidak ingin upload...' : 'Atau tempel Link URL gambar langsung di sini...'}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#101c33] border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:border-[#D4A017] outline-none"
          />
        </div>
        {isBase64 && (
          <span className="text-[8px] font-mono text-emerald-500 uppercase font-black bg-emerald-500/10 px-1.5 py-0.5 rounded">
            UPLOADED
          </span>
        )}
      </div>

      {/* Fast presets dropdown if provided (e.g. for delivery presets) */}
      {presetOptions.length > 0 && !isBase64 && (
        <div className="bg-[#050914] p-1.5 border border-white/5 rounded">
          <span className="text-[7.5px] font-mono text-[#D4A017] uppercase block tracking-wider mb-1">Preset Cepat Galeri:</span>
          <div className="flex flex-wrap gap-1">
            {presetOptions.map((opt, oIdx) => (
              <button
                type="button"
                key={oIdx}
                onClick={() => onChange(opt.url)}
                className="text-[7.5px] font-bold text-gray-400 hover:text-white bg-[#0e172a] hover:bg-[#1a233b] border border-white/10 px-1.5 py-0.5 rounded cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
