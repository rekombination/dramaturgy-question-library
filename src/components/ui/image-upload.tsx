"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  endpoint: "avatarUploader" | "contentImageUploader";
  value?: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export function ImageUpload({
  endpoint,
  value = [],
  onChange,
  maxFiles = 1,
  className,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const urls = res.map((file) => file.url);
      onChange([...value, ...urls]);
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles);
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig ? generateClientDropzoneAccept(Object.keys(routeConfig)) : undefined,
    maxFiles: maxFiles - value.length,
    disabled: isUploading || value.length >= maxFiles,
  });

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {value.map((url) => (
            <div key={url} className="relative group">
              <div className="relative h-24 w-24 rounded-lg overflow-hidden border">
                <Image
                  src={url}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive && "border-primary bg-primary/5",
            isUploading && "opacity-50 cursor-not-allowed",
            !isDragActive && !isUploading && "border-muted-foreground/25 hover:border-primary"
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <p className="text-sm text-muted-foreground">Uploading...</p>
          ) : isDragActive ? (
            <p className="text-sm text-primary">Drop files here</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Drag & drop images here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG, WebP, AVIF (max 8MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface VideoUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  className?: string;
}

export function VideoUpload({ value, onChange, className }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing("videoUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]) {
        onChange(res[0].url);
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles);
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig ? generateClientDropzoneAccept(Object.keys(routeConfig)) : undefined,
    maxFiles: 1,
    disabled: isUploading || !!value,
  });

  return (
    <div className={cn("space-y-4", className)}>
      {value && (
        <div className="relative">
          <video
            src={value}
            controls
            className="w-full max-h-64 rounded-lg"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onChange(undefined)}
            className="absolute top-2 right-2"
          >
            Remove
          </Button>
        </div>
      )}

      {!value && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            isDragActive && "border-primary bg-primary/5",
            isUploading && "opacity-50 cursor-not-allowed",
            !isDragActive && !isUploading && "border-muted-foreground/25 hover:border-primary"
          )}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <p className="text-sm text-muted-foreground">Uploading video...</p>
          ) : isDragActive ? (
            <p className="text-sm text-primary">Drop video here</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Drag & drop a video here, or click to select
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, WebM (max 64MB)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
