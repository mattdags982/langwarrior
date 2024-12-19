"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function Dev() {
  return (
    <div className="flex items-center justify-center h-screen">
      <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}>
        {({ open }) => {
          return (
            <button onClick={() => open()}>
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
