export const stepsToUnlockCamera = [
  {
    step: "Step 1:",
    title: "Click on the Lock Icon",
    description:
      "At the top-left of your browser, click on the lock icon or camera icon next to the website's URL.",
  },
  {
    step: "Step 2:",
    title: "Check Camera Permissions",
    description: "In the dropdown, locate the Camera permission.",
  },
  {
    step: "Step 3:",
    title: "Allow Camera Access",
    description: "Change the permission from Block to Allow.",
  },
  {
    step: "Step 4:",
    title: "Reload the Page",
    description: "Refresh this page to apply the updated permissions.",
  },
];

// cloudinaryUpload.js
export const cloudinaryUpload = async (capturedImage) => {
  if (!capturedImage) return null;

  const data = new FormData();
  const blob = await fetch(capturedImage).then((res) => res.blob());
  data.append("file", blob);
  data.append("upload_preset", "insta_clone");
  data.append("cloud_name", "cqn");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/cqn/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const uploadedData = await response.json();
    return uploadedData.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("Failed to upload image.");
  }
};
