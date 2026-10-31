import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';

interface LogoUploaderProps {
  value: string;
  onChange: (urlOrDataUrl: string) => void;
  maxSizeMB?: number;
  label?: string;
  required?: boolean;
  className?: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  value,
  onChange,
  maxSizeMB = 2,
  label = 'Logotipo da Loja / Empresa',
  required = false,
  className = ''
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState(value && value.startsWith('http') ? value : '');
  const [fileDetails, setFileDetails] = useState<{ name: string; sizeKB: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFile = (file: File) => {
    setError(null);

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      setError('Formato inválido. Por favor, envie uma imagem (PNG, JPG, JPEG, WEBP ou SVG).');
      return;
    }

    // Validate maximum file size
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(
        `O arquivo excede o tamanho máximo permitido de ${maxSizeMB} MB (tamanho do arquivo: ${fileSizeMB} MB). Reduza o tamanho da imagem ou escolha outro arquivo.`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Convert file to Data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
        setFileDetails({
          name: file.name,
          sizeKB: Math.round(file.size / 1024)
        });
      }
    };
    reader.onerror = () => {
      setError('Erro ao ler a imagem. Tente novamente.');
    };
    reader.readAsDataURL(file);
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileDetails(null);
    setError(null);
    setCustomUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUrlSubmit = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setFileDetails(null);
      setError(null);
    }
  };

  const hasLogo = Boolean(value && value.trim().length > 0);

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & Max Size Pill */}
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-[#17251D] flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[#07552F] bg-[#E9F6EC] px-2.5 py-0.5 rounded-full border border-[#07843B]/20">
          <span>Máx: {maxSizeMB} MB</span>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Upload & Preview Area */}
      {hasLogo ? (
        /* Preview Card with Image & Action */
        <div className="p-3 bg-white border border-[#07843B]/30 rounded-xl shadow-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-14 h-14 rounded-lg border border-[#E5EBE6] bg-[#F7F9F7] p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              <img
                src={value}
                alt="Logo pré-visualização"
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=300&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#07552F]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#07843B] shrink-0" />
                <span className="truncate">Logo carregado com sucesso</span>
              </div>
              <p className="text-[11px] text-[#68746C] truncate mt-0.5">
                {fileDetails ? `${fileDetails.name} (${fileDetails.sizeKB} KB)` : 'Imagem vinculada'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-semibold text-[#07843B] hover:text-[#07552F] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Trocar logo</span>
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="w-8 h-8 rounded-full bg-[#F7F9F7] hover:bg-red-50 text-[#68746C] hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-[#E5EBE6]"
            title="Remover logotipo"
            aria-label="Remover logotipo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : showUrlInput ? (
        /* Alternative: External URL link input */
        <div className="p-3 bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#17251D]">Link direto da imagem (URL)</span>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="text-[#07843B] hover:underline text-[11px] font-semibold cursor-pointer"
            >
              Voltar para upload de arquivo
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://exemplo.com/logo.png"
              className="flex-1 px-3 py-2 text-xs bg-white border border-[#E5EBE6] rounded-lg focus:border-[#07843B] outline-none text-[#17251D]"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-3 py-2 bg-[#07843B] hover:bg-[#07552F] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Usar Link
            </button>
          </div>
        </div>
      ) : (
        /* Dropzone / Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[#07843B] bg-[#E9F6EC]'
              : 'border-[#E5EBE6] hover:border-[#07843B] bg-[#F7F9F7] hover:bg-[#E9F6EC]/40'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-[#E9F6EC] text-[#07843B] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Upload className="w-5 h-5" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-[#17251D]">
            Clique para enviar o logo ou arraste aqui
          </p>
          <p className="text-[11px] text-[#68746C] mt-1">
            Formatos aceitos: <strong>PNG, JPG, WEBP, SVG</strong> • Tamanho máximo: <strong>{maxSizeMB} MB</strong>
          </p>

          <div className="mt-2.5 pt-2 border-t border-[#E5EBE6]/60 flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowUrlInput(true);
              }}
              className="text-[11px] font-semibold text-[#07843B] hover:text-[#07552F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LinkIcon className="w-3 h-3" />
              <span>Ou prefere inserir o link de uma imagem?</span>
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </div>
      )}
    </div>
  );
};
