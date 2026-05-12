'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { logger } from '@/lib/logger'
import { useUser } from '@/context/UserContext'

interface DocumentUploadProps {
  bucketName: string;
  folderPath?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  onFileUploaded?: (fileData: FileUploadResult) => void;
  multiple?: boolean;
  className?: string;
  /** When set, the hidden file input uses this id so other buttons can trigger it via click(). */
  fileInputId?: string;
}

export interface UploadedFileData {
  key: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export type FileUploadResult = UploadedFileData | { error: string };

// Default configuration
const DEFAULT_ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png'
];

const DEFAULT_MAX_SIZE_MB = 10;

export default function DocumentUpload({
  bucketName,
  folderPath = '',
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  onFileUploaded,
  multiple = false,
  className = '',
  fileInputId
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userName } = useUser();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Reset state
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Process each file (upload runs on the server via /api/documents/upload)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!allowedTypes.includes(file.type)) {
          setError(`File type not allowed: ${file.type}`);
          if (onFileUploaded) {
            onFileUploaded({ error: `File type not allowed: ${file.type}` } as FileUploadResult);
          }
          continue;
        }
        
        // Validate file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB) {
          const errorMsg = `File too large: ${file.name} (${fileSizeMB.toFixed(2)}MB). Max size: ${maxSizeMB}MB`;
          setError(errorMsg);
          if (onFileUploaded) {
            onFileUploaded({ error: errorMsg } as FileUploadResult);
          }
          continue;
        }
        
        const objectUrl = URL.createObjectURL(file);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucketName', bucketName);
        formData.append('folderPath', folderPath);

        logger.info('Uploading file via API', {
          context: 'DOCUMENT_UPLOAD',
          data: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            bucketName,
            folderPath,
          },
        });

        const res = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });
        const payload = (await res.json()) as {
          success?: boolean;
          key?: string;
          name?: string;
          type?: string;
          size?: number;
          url?: string | null;
          error?: string;
        };

        if (!res.ok || !payload.success) {
          URL.revokeObjectURL(objectUrl);
          const errorMsg = payload.error || `Failed to upload: ${file.name}`;
          setError(errorMsg);
          if (onFileUploaded) {
            onFileUploaded({ error: errorMsg } as FileUploadResult);
          }
          logger.error('Document upload API failed', {
            context: 'DOCUMENT_UPLOAD',
            data: { fileName: file.name, status: res.status, error: payload.error },
          });
          continue;
        }

        const resolvedUrl = payload.url || objectUrl;
        if (payload.url) {
          URL.revokeObjectURL(objectUrl);
        }

        if (payload.key) {
          const fileData: UploadedFileData = {
            key: payload.key,
            name: payload.name ?? file.name,
            type: payload.type ?? file.type,
            size: payload.size ?? file.size,
            url: resolvedUrl,
            uploadedAt: new Date(),
          };
          
          setUploadedFiles(prev => [...prev, fileData]);
          
          if (onFileUploaded) {
            onFileUploaded(fileData);
          }

          logger.trackUserAction('DOCUMENT_UPLOADED', userName || undefined, {
            fileType: file.type,
            fileSize: file.size,
          });
        }
        
        // Update progress
        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during upload';
      console.error('Error during file upload:', err);
      setError(errorMsg);
      if (onFileUploaded) {
        onFileUploaded({ error: errorMsg } as FileUploadResult);
      }
      logger.error('Unexpected error in document upload', {
        context: 'DOCUMENT_UPLOAD',
        data: { error: err }
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) {
      return '📄';
    } else if (type.includes('word')) {
      return '📝';
    } else if (type.includes('excel') || type.includes('sheet')) {
      return '📊';
    } else if (type.includes('image')) {
      return '🖼️';
    }
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`document-upload ${className}`}>
      <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        <input
          type="file"
          id={fileInputId}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          disabled={isUploading}
        />
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
        >
          {isUploading ? 'Uploading...' : 'Select File'}
        </button>
        
        <p className="mt-2 text-sm text-gray-500">
          {multiple ? 'Upload documents' : 'Upload a document'} (Max size: {maxSizeMB}MB)
        </p>
        
        {uploadProgress !== null && (
          <div className="w-full mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress}% uploaded</p>
          </div>
        )}
        
        {error && (
          <div className="mt-3 text-sm text-red-500">
            {error}
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h3>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center p-2 bg-white border border-gray-200 rounded-lg">
                <span className="text-lg mr-2">{getFileTypeIcon(file.type)}</span>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 