import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileVideo, 
  Image as ImageIcon,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { formatBytes, validateFile, compressImage, readFileAsDataUrl } from '../../services/mediaService';

interface MediaUploaderProps {
  label: string;
  helperText?: string;
  currentUrl?: string;
  maxSizeBytes: number;
  mediaType: 'image' | 'video';
  allowedTypes?: string[];
  aspectRatioHint?: string;
  onMediaSelected: (url: string) => void;
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  helperText,
  currentUrl,
  maxSizeBytes,
  mediaType,
  allowedTypes = mediaType === 'image' 
    ? ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'] 
    : ['video/mp4', 'video/webm', 'video/quicktime'],
  aspectRatioHint,
  onMediaSelected,
  className = ''
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    originalSize: string;
    finalSize: string;
    compressed: boolean;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxFormatted = formatBytes(maxSizeBytes);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // 1. Validate file format and hard size limit
      const validation = validateFile(file, maxSizeBytes, allowedTypes);
      if (!validation.valid) {
        setErrorMessage(validation.error || 'Arquivo inválido.');
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const origSize = file.size;

      if (mediaType === 'image') {
        // Automatically compress images to keep platform lightweight
        const compressedDataUrl = await compressImage(file, 1600, 1600, 0.85);
        
        // Approximate bytes from base64 string
        const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
        
        setFileDetails({
          name: file.name,
          originalSize: formatBytes(origSize),
          finalSize: formatBytes(approxBytes),
          compressed: origSize > approxBytes
        });

        onMediaSelected(compressedDataUrl);
      } else {
        // Video file: read as data url (within max 15MB limit)
        const videoDataUrl = await readFileAsDataUrl(file);
        setFileDetails({
          name: file.name,
          originalSize: formatBytes(origSize),
          finalSize: formatBytes(origSize),
          compressed: false
        });
        onMediaSelected(videoDataUrl);
      }
    } catch (err) {
      console.error('Erro ao processar mídia:', err);
      setErrorMessage('Erro ao ler e processar arquivo. Tente novamente.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = (e?: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
    if (e && 'preventDefault' in e) e.preventDefault();
    if (!urlInput.trim()) return;
    setErrorMessage(null);
    onMediaSelected(urlInput.trim());
    setFileDetails(null);
  };

  const handleClear = () => {
    setUrlInput('');
    setFileDetails(null);
    setErrorMessage(null);
    onMediaSelected('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label and Maximum Size Badge */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#17251D] flex items-center gap-1.5">
          {mediaType === 'image' ? <ImageIcon className="w-3.5 h-3.5 text-[#00A86B]" /> : <FileVideo className="w-3.5 h-3.5 text-[#0F52BA]" />}
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          {aspectRatioHint && (
            <span className="text-[10px] bg-[#EBF8F2] text-[#00553A] font-semibold px-2 py-0.5 rounded-md border border-[#66CDAA]/40">
              {aspectRatioHint}
            </span>
          )}
          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
            Máx: {maxFormatted}
          </span>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-[#68746C]">{helperText}</p>
      )}

      {/* Switch between Upload and External URL */}
      <div className="flex items-center gap-2 p-1 bg-[#F4FAF6] rounded-xl border border-[#E2ECE5] text-xs">
        <button
          type="button"
          onClick={() => setActiveMode('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
            activeMode === 'upload'
              ? 'bg-white text-[#00A86B] shadow-xs border border-[#E2ECE5]'
              : 'text-[#68746C] hover:text-[#17251D]'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Enviar Arquivo</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg font-bold transition-all cursor-pointer ${
            activeMode === 'url'
              ? 'bg-white text-[#0F52BA] shadow-xs border border-[#E2ECE5]'
              : 'text-[#68746C] hover:text-[#17251D]'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Link / URL Direta</span>
        </button>
      </div>

      {/* Upload Mode */}
      {activeMode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={allowedTypes.join(',')}
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
              isProcessing 
                ? 'border-[#00A86B] bg-[#EBF8F2]/50'
                : 'border-[#CADBD0] hover:border-[#00A86B] bg-white hover:bg-[#F4FAF6]'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center py-2 gap-2 text-[#00A86B]">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-bold">Otimizando e preparando mídia...</span>
                <span className="text-[10px] text-[#68746C]">Respeitando limite de {maxFormatted}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-10 h-10 rounded-full bg-[#EBF8F2] flex items-center justify-center text-[#00A86B] mb-0.5">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-[#17251D]">
                  Clique para selecionar arquivo do seu dispositivo
                </span>
                <span className="text-[11px] text-[#68746C]">
                  {mediaType === 'image' ? 'PNG, JPG, WebP ou SVG' : 'MP4, WebM (vídeo vertical 9:16)'} • Limite máximo de {maxFormatted}
                </span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* URL Mode - uses div container to prevent nested form validation errors in modals */}
      {activeMode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleUrlSubmit(e);
              }
            }}
            placeholder={mediaType === 'image' ? 'https://exemplo.com/imagem.jpg' : 'https://exemplo.com/video.mp4'}
            className="flex-1 px-3 py-2 text-xs border border-[#E2ECE5] rounded-xl focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] outline-none text-[#17251D]"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-[#00A86B] hover:bg-[#00553A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1 font-medium">{errorMessage}</span>
          <button 
            type="button" 
            onClick={() => setErrorMessage(null)} 
            className="text-red-500 hover:text-red-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* File compression feedback */}
      {fileDetails && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5 truncate">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate font-semibold">{fileDetails.name}</span>
          </div>
          <span className="font-mono text-[10px] shrink-0 font-bold">
            {fileDetails.compressed 
              ? `${fileDetails.originalSize} ➔ ${fileDetails.finalSize} (Otimizado)`
              : fileDetails.finalSize}
          </span>
        </div>
      )}

      {/* Live Preview Container */}
      {currentUrl && (
        <div className="relative rounded-xl border border-[#E2ECE5] bg-[#F7F9F7] p-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {mediaType === 'image' ? (
              <img
                src={currentUrl}
                alt="Pré-visualização"
                className="w-16 h-12 object-cover rounded-lg border border-[#E2ECE5] bg-white shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder_store.png';
                }}
              />
            ) : currentUrl ? (
              <video
                src={currentUrl}
                className="w-12 h-16 object-cover rounded-lg border border-[#E2ECE5] bg-black shrink-0"
                muted
                loop
                autoPlay
                playsInline
                onError={(e) => {
                  (e.target as HTMLVideoElement).style.opacity = '0';
                }}
              />
            ) : null}
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-[#17251D] block truncate">
                Mídia ativa
              </span>
              <span className="text-[10px] text-[#68746C] truncate block max-w-xs font-mono">
                {currentUrl.startsWith('data:') ? 'Arquivo armazenado no app (otimizado)' : currentUrl}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Remover mídia"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
