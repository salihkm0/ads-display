// // const cloudinary = require('cloudinary').v2
// const Video = require("../models/adsModel");
// const path = require("path");
// const fs = require("fs");
// const { cloudinary } = require("../config/cloudinary");

// // Cloudinary configuration
// require("dotenv").config();

// // Upload video to Cloudinary
// exports.uploadVideo = async (req, res) => {
//   try {
//     // Ensure file is provided by multer
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const filePath = path.join(__dirname, "../uploads", req.file.filename);

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(filePath, {
//       resource_type: "video",
//       folder: "ads_videos",
//     });

//     const uploadedFileSizeMB = req.file.size / (1024 * 1024); // Convert bytes to MB
//     const videoDuration = result.duration; // in seconds

//     console.log("Video limit : " + videoDuration , "videoSize : " + uploadedFileSizeMB);

//     // Define limit conditions
//     const limits = [
//       { maxDuration: 6, maxSizeMB: 1 }, // 0.5 minute (30 seconds) - 38 MB
//       { maxDuration: 60, maxSizeMB: 75 }, // 1 minute (60 seconds) - 75 MB
//       { maxDuration: 300, maxSizeMB: 375 }, // 5 minutes (300 seconds) - 375 MB
//       { maxDuration: 600, maxSizeMB: 750 }, // 10 minutes (600 seconds) - 750 MB
//     ];

//     // Check if video meets any of the allowed limits
//     const isValid = limits.some(
//       (limit) =>
//         videoDuration <= limit.maxDuration &&
//         uploadedFileSizeMB <= limit.maxSizeMB
//     );

//     if (!isValid) {
//       // Delete the video from Cloudinary if it doesn't meet the limits
//       await cloudinary.uploader.destroy(result.public_id, {
//         resource_type: "video",
//       });
//       return res.status(400).json({
//         message: "Video exceeds allowed duration or size limits.",
//       });
//     }

//     // Save video metadata to MongoDB
//     const newVideo = new Video({
//       filename: req.body.filename ? req.body.filename : req.file.originalname,
//       fileUrl: result.secure_url,
//       cloudinaryId: result.public_id,
//     });
//     await newVideo.save();

//     // Remove the local file after successful upload
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     res.json({ message: "Video uploaded successfully!", video: newVideo });
//   } catch (error) {
//     console.error("Error uploading video:", error);
//     res.status(500).json({ message: "Failed to upload video", error });
//   }
// };

const Video = require("../models/adsModel");
const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../config/cloudinary");
const axios = require("axios");
require("dotenv").config();

exports.uploadVideo = async (req, res) => {
  try {
    // Ensure file is provided by multer
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "ads_videos",
    });

    const uploadedFileSizeMB = req.file.size / (1024 * 1024); // Convert bytes to MB
    const videoDuration = result.duration; // in seconds

    console.log(
      "Video duration (sec): " + videoDuration,
      "Video size (MB): " + uploadedFileSizeMB
    );

    // Define limit conditions (maxDuration in seconds and maxSizeMB in MB)
    const limits = [
      { maxDuration: 30, maxSizeMB: 38 }, // 0.5 minute (30 seconds) - 38 MB
      { maxDuration: 60, maxSizeMB: 75 }, // 1 minute (60 seconds) - 75 MB
      { maxDuration: 300, maxSizeMB: 375 }, // 5 minutes (300 seconds) - 375 MB
      { maxDuration: 600, maxSizeMB: 750 }, // 10 minutes (600 seconds) - 750 MB
    ];

    // if (videoDuration <= 27 && uploadedFileSizeMB <= 38) {
    //     return res.status(400).json({
    //         message: "Video duration and size exceeds the limit. only alowed size 38MB max and duration 30s Max",})
    // }

    // Check if the video matches any limit in terms of duration and size
    // const isValid = limits.some(
    //   (limit) =>
    //     videoDuration <= limit.maxDuration &&
    //     uploadedFileSizeMB <= limit.maxSizeMB
    // );

    // if (!isValid) {
    //   // Delete the video from Cloudinary if it doesn't meet the limits
    //   await cloudinary.uploader.destroy(result.public_id, {
    //     resource_type: "video",
    //   });
    //   return res.status(400).json({
    //     message: "Video exceeds allowed duration or size limits.",
    //   });
    // }

    // Save video metadata to MongoDB
    const newVideo = new Video({
      filename: req.body.filename ? req.body.filename : req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });
    await newVideo.save();

    // Remove the local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: "Video uploaded successfully!", video: newVideo });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ message: "Failed to upload video", error });
  }
};

// Fetch videos from MongoDB
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Failed to retrieve videos" });
  }
};


exports.deleteVideo = async (req, res) => {
    // try {
    //   const videoId = req.params.id;
  
    //   // Find the video in the database to get the Cloudinary public_id
    //   const video = await Video.findById(videoId);
    //   if (!video) {
    //     return res.status(404).json({ message: "Video not found" });
    //   }
  
    //   // Delete the video from Cloudinary using the public_id
    //   const cloudinaryResponse = await cloudinary.uploader.destroy(video.cloudinaryId, {
    //     resource_type: "video",
    //   });
  
    //   if (cloudinaryResponse.result !== "ok") {
    //     return res.status(500).json({ message: "Failed to delete video from Cloudinary" });
    //   }
  
    //   // Delete the video metadata from MongoDB
    //   await Video.findByIdAndDelete(videoId);
  
    //   res.json({ message: "Video deleted successfully!" });
    // } catch (error) {
    //   console.error("Error deleting video:", error);
    //   res.status(500).json({ message: "Failed to delete video", error });
    // }


    try {
        const videoId = req.params.id;
        const video = await Video.findById(videoId);
    
        if (!video) return res.status(404).json({ message: 'Video not found' });
    
        await cloudinary.uploader.destroy(video.cloudinaryId, { resource_type: 'video' });
        await Video.findByIdAndDelete(videoId);
    
        // Notify the "Pi" server to delete the local copy
        await axios.post('https://fe39-2409-40f3-2c-f104-de4-9fa6-6b3b-5d67.ngrok-free.app/delete-video', { filename: video.filename });
    
        res.json({ message: 'Video deleted successfully' });
        console.log('Video deleted successfully')
      } catch (error) {
        console.error("Error deleting video:", error);
        res.status(500).json({ message: "Failed to delete video", error });
      }
  };


