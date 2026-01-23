"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { startUpload } = useUploadThing("profileImage");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    try {
      const result = await startUpload([file]);
      if (result && result[0]) {
        onUploadComplete(result[0].url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
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
        <Avatar className="h-24 w-24 border-3 border-foreground">
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
                className="font-bold"
                asChild
              >
                <span>
                  <IconUpload size={16} className="mr-2" />
                  {isUploading ? "Uploading..." : "Upload New"}
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
            JPG, PNG or GIF. Max 4MB.
          </p>
        </div>
      </div>
    </div>
  );
}
