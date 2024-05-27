import { createClient } from "@/lib/supabase/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
        // This code runs on your server before upload
            const supabase = createClient()
            const user = await supabase.auth.getUser()

            // If you throw, the user will not be able to upload
            if (!user.data.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.data.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
    productImagesUploader: f({ image: { maxFileSize: "64MB", maxFileCount: 1 } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
        // This code runs on your server before upload
            const supabase = createClient()
            const user = await supabase.auth.getUser()

            // If you throw, the user will not be able to upload
            if (!user.data.user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.data.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
