import type { Express, Request, Response } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { CalendarController } from "./controllers/calendar";
import { PhotoController } from "./controllers/photos";
import { SettingsController } from "./controllers/settings";
import { fetchWeatherData } from "./services/weather";
import multer from "multer";
import fs from "fs";
import path from "path";

// Initialize controllers
const calendarController = new CalendarController(storage);
const photoController = new PhotoController(storage);
const settingsController = new SettingsController(storage);

// Setup multer for file uploads
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Create photos directory if it doesn't exist
  const settings = await storage.getSettings();
  const photoDir = settings.photoDirectory || "./photos";
  if (!fs.existsSync(photoDir)) {
    fs.mkdirSync(photoDir, { recursive: true });
  }

  // Serve static photos
  app.use("/api/photos/files", express.static(photoDir));

  // Calendar routes
  app.get("/api/calendar", async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string | undefined;
      const weeklyEvents = await calendarController.getWeeklyEvents(date);
      res.json(weeklyEvents);
    } catch (error) {
      console.error("Failed to get calendar data:", error);
      res.status(500).json({ message: "Failed to get calendar data" });
    }
  });

  // Weather route
  app.get("/api/weather", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSettings();
      const weatherData = await fetchWeatherData(
        settings.weatherLocation || "New York,US",
        (settings.tempUnit as "F" | "C") || "F",
        settings.weatherApiKey
      );
      res.json(weatherData || { error: "Weather data unavailable" });
    } catch (error) {
      console.error("Failed to get weather data:", error);
      res.status(500).json({ message: "Failed to get weather data" });
    }
  });

  // Photo routes
  app.get("/api/photos", async (_req: Request, res: Response) => {
    try {
      const photos = await photoController.getAllPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Failed to get photos:", error);
      res.status(500).json({ message: "Failed to get photos" });
    }
  });

  // Single photo upload
  app.post(
    "/api/photos/upload",
    upload.single("photo"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const photo = await photoController.savePhoto(req.file);
        res.json(photo);
      } catch (error) {
        console.error("Failed to upload photo:", error);
        res.status(500).json({ message: "Failed to upload photo" });
      }
    }
  );
  
  // Bulk photo upload
  app.post(
    "/api/photos/upload-bulk",
    upload.array("photos", 20), // Allow up to 20 photos at once
    async (req: Request, res: Response) => {
      try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
          return res.status(400).json({ message: "No files uploaded" });
        }
        
        const uploadedPhotos = [];
        for (const file of req.files) {
          const photo = await photoController.savePhoto(file);
          uploadedPhotos.push(photo);
        }
        
        res.json({ 
          success: true, 
          count: uploadedPhotos.length,
          photos: uploadedPhotos 
        });
      } catch (error) {
        console.error("Failed to upload photos:", error);
        res.status(500).json({ message: "Failed to upload photos" });
      }
    }
  );

  app.delete("/api/photos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await photoController.deletePhoto(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Photo not found" });
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      res.status(500).json({ message: "Failed to delete photo" });
    }
  });

  // Tasks routes
  app.get("/api/tasks", async (_req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      console.error("Failed to get tasks:", error);
      res.status(500).json({ message: "Failed to get tasks" });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const task = await storage.createTask(req.body);
      res.json(task);
    } catch (error) {
      console.error("Failed to create task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.updateTask(id, req.body);
      if (task) {
        res.json(task);
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Task not found" });
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Settings routes
  app.get("/api/settings", async (_req: Request, res: Response) => {
    try {
      const appSettings = await settingsController.getAppSettings();
      res.json(appSettings);
    } catch (error) {
      console.error("Failed to get settings:", error);
      res.status(500).json({ message: "Failed to get settings" });
    }
  });

  app.put("/api/settings", async (req: Request, res: Response) => {
    try {
      const updatedSettings = await settingsController.updateAppSettings(
        req.body
      );
      res.json(updatedSettings);
    } catch (error) {
      console.error("Failed to update settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Family Member routes
  app.post("/api/family-members", async (req: Request, res: Response) => {
    try {
      const member = await settingsController.addFamilyMember(req.body);
      res.json(member);
    } catch (error) {
      console.error("Failed to add family member:", error);
      res.status(500).json({ message: "Failed to add family member" });
    }
  });

  app.put("/api/family-members/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const member = await settingsController.updateFamilyMember(id, req.body);
      if (member) {
        res.json(member);
      } else {
        res.status(404).json({ message: "Family member not found" });
      }
    } catch (error) {
      console.error("Failed to update family member:", error);
      res.status(500).json({ message: "Failed to update family member" });
    }
  });

  app.delete("/api/family-members/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await settingsController.deleteFamilyMember(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ message: "Family member not found" });
      }
    } catch (error) {
      console.error("Failed to delete family member:", error);
      res.status(500).json({ message: "Failed to delete family member" });
    }
  });

  // Meal Calendar route
  app.put("/api/meal-calendar", async (req: Request, res: Response) => {
    try {
      const { calendarUrl } = req.body;
      const mealCalendar = await settingsController.setMealCalendar(calendarUrl);
      res.json(mealCalendar);
    } catch (error) {
      console.error("Failed to update meal calendar:", error);
      res.status(500).json({ message: "Failed to update meal calendar" });
    }
  });

  return httpServer;
}
