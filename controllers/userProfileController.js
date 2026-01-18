    import UserProfile from "../models/UserProfile.js";
    import cloudinary from "../config/cloudinary.js";

    // GET profile
    export const getProfile = async (req, res) => {
  const profile = await UserProfile
  .findOne({ user: req.user._id })
  .populate("user", "name email");

    res.json(profile || {});
    };

    // CREATE or UPDATE profile
    export const upsertProfile = async (req, res) => {
    const updated = await UserProfile.findOneAndUpdate(
        { user: req.user._id },
        { ...req.body, user: req.user._id },
        { new: true, upsert: true }
    );
    res.json(updated);
    };

    // Upload profile image
    export const uploadProfileImage = async (req, res) => {
    const profile = await UserProfile
  .findOne({ user: req.user._id })
  .populate("user", "name email");


    if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
    }

    profile.profileImage = req.file.path;
    await profile.save();

    res.json({ profileImage: req.file.path });
    };

    // Upload resume (PDF)
    export const uploadResume = async (req, res) => {
  const profile = await UserProfile
  .findOne({ user: req.user._id })
  .populate("user", "name email");


    if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.resumePublicId) {
        await cloudinary.uploader.destroy(profile.resumePublicId);
    }

    profile.resumeUrl = req.file.path;
    profile.resumePublicId = req.file.filename;
    await profile.save();

    res.json({ resumeUrl: profile.resumeUrl });
    };
