import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: isPdf ? "resumes" : "profile-images",
      resource_type: isPdf ? "raw" : "image",
      allowed_formats: isPdf
        ? ["pdf"]
        : ["jpg", "png", "jpeg", "webp"],
    };
  },
});

const upload = multer({ storage });

export default upload;
