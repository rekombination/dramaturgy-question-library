"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { convertImageToWebP } from "@/lib/image-converter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconUpload, IconX } from "@tabler/icons-react";

interface ProfileImageUploadProps {
  currentImage?: string | null;
  userName?: string | null;
  onUploadComplete: (url: string) => void;
}

export function ProfileImageUpload({
  currentImage,
  userName,
  onUploadComplete,
}: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { startUpload } = useUploadThing("profileImage", {
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Upload
    setIsUploading(true);
    try {
      // Convert image to WebP before upload (512x512, quality 0.9)
      const convertedFile = await convertImageToWebP(file, 0.9, 512, 512);

      // Create preview from converted file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(convertedFile);

      const result = await startUpload([convertedFile]);
      if (result && result[0]) {
        onUploadComplete(result[0].ufsUrl);
        // Clear preview so currentImage (the uploaded URL) is shown
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold">Profile Picture</label>
      
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border-2 border-foreground">
          <AvatarImage src={displayImage || ""} alt={userName || ""} />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl">
            {userName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <div className="flex gap-3">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="sr-only"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                className="font-bold relative overflow-hidden"
                asChild
              >
                <span>
                  {/* Progress bar background */}
                  {isUploading && (
                    <span
                      className="absolute inset-0 bg-primary/20 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  )}

                  {/* Button content */}
                  <span className="relative z-10 inline-flex items-center">
                    <IconUpload size={16} className="mr-2" />
                    {isUploading ? `Uploading... ${uploadProgress}%` : "Upload New"}
                  </span>
                </span>
              </Button>
            </label>

            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearPreview}
                className="font-bold"
              >
                <IconX size={16} className="mr-2" />
                Cancel
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            JPG, PNG or GIF. Automatically converted to WebP. Max 4MB.
          </p>
        </div>
      </div>
    </div>
  );
}
