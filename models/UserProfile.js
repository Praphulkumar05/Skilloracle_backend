import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phone: String,
    location: String,
    bio: String,
    profileImage: String,

    jobTitle: String,
    experienceLevel: {
      type: String,
      enum: ["student", "junior", "mid", "senior"],
    },

    website: String,
    skills: [String],

    githubUsername: String,
    linkedinUrl: String,

    resumeUrl: String,
    resumePublicId: String,
  },
  { timestamps: true }
);

// ✅ CREATE MODEL
const UserProfile = mongoose.model("UserProfile", userProfileSchema);

// ✅ DEFAULT EXPORT (THIS FIXES YOUR ERROR)
export default UserProfile;
