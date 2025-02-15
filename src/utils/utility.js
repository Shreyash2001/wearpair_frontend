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

export const generateShades = (hex, numShades = 5) => {
  console.log(hex);
  const lightenDarkenColor = (col, amt) => {
    let usePound = false;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }

    let num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00ff) + amt;
    let b = (num & 0x0000ff) + amt;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return (
      (usePound ? "#" : "") +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    );
  };

  let shades = [];
  for (let i = 2; i >= -2; i--) {
    shades.push(lightenDarkenColor(hex, i * 30)); // Adjust brightness by ±30
  }

  return shades;
};

// https://wearpair-backend.vercel.app
export const BASE_URI = "http://localhost:5000";
