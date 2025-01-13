const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: `*` }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Mongoose schema and model for feedback
const feedbackSchema = new mongoose.Schema({
  suggestions: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ipAddress: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

// Route to log feedback
app.post("/feedback", async (req, res) => {
  try {
    const { suggestions, name, ipAddress } = req.body;

    // Log the data received from the frontend
    console.log("Received feedback:", { suggestions, name, ipAddress });

    // Validate input
    if (!suggestions || !name || !ipAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save feedback to the database
    const feedback = new FeedbackModel({ suggestions, name, ipAddress });
    await feedback.save();

    console.log("Feedback saved successfully");

    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Default route for checking server status
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
