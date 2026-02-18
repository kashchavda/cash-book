    import express from "express";
    import {
    getProfile,
    updateProfile,
    uploadProfilePhoto,
    updateNotificationSettings
    } from "../controllers/profile.controller";
    import { protect } from "../middlewares/auth.middleware";

    import { upload } from "../middlewares/upload";

    const router = express.Router();

    router.get("/me",protect ,getProfile);
    router.put("/me", updateProfile);

    router.post("/me/photo", upload.single("photo"), uploadProfilePhoto);

    router.put("/me/notification-settings", updateNotificationSettings);

    export default router;
