import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";

const f = createUploadthing();

export const ourFileRouter = {
  // Avatar upload - small images only
  avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Avatar upload complete for user:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Question/Reply images - supports modern formats
  contentImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Content image upload complete:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Video uploads for questions/replies
  videoUploader: f({
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      // Check for trusted users or above for video uploads
      if (session.user.trustLevel === "NEW") {
        throw new Error("New users cannot upload videos yet");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Video upload complete:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Document uploads (PDFs for toolkits)
  documentUploader: f({
    pdf: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");
      // Only moderators and admins can upload documents
      if (!["MODERATOR", "ADMIN"].includes(session.user.role)) {
        throw new Error("Only moderators can upload documents");
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Document upload complete:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
