import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { bookSpotSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for parking spots
  app.get("/api/parking-spots", async (req, res) => {
    try {
      const spots = await storage.getAllParkingSpots();
      res.json(spots);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking spots" });
    }
  });
  
  app.get("/api/parking-spots/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch parking statistics" });
    }
  });
  
  // Book a parking spot
  app.post("/api/parking-spots/book", async (req, res) => {
    try {
      const bookingData = bookSpotSchema.parse(req.body);
      
      // Find the spot by name
      const spot = await storage.getParkingSpotByName(bookingData.spotName);
      
      if (!spot) {
        return res.status(404).json({ message: "Parking spot not found" });
      }
      
      if (spot.status !== "available") {
        return res.status(400).json({ message: "Parking spot is not available" });
      }
      
      // Update the spot
      const updatedSpot = await storage.updateParkingSpot(spot.id, {
        status: "reserved",
        vehicleNumber: bookingData.vehicleNumber,
        bookingDuration: bookingData.duration,
        bookedAt: new Date()
      });
      
      // Log the activity
      await storage.createActivity({
        spotName: bookingData.spotName,
        action: "booked",
        vehicleNumber: bookingData.vehicleNumber
      });
      
      res.json(updatedSpot);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to book parking spot" });
    }
  });
  
  // Free a parking spot
  app.post("/api/parking-spots/free", async (req, res) => {
    try {
      const { spotName } = req.body;
      
      if (!spotName) {
        return res.status(400).json({ message: "Spot name is required" });
      }
      
      // Find the spot by name
      const spot = await storage.getParkingSpotByName(spotName);
      
      if (!spot) {
        return res.status(404).json({ message: "Parking spot not found" });
      }
      
      if (spot.status === "available") {
        return res.status(400).json({ message: "Parking spot is already available" });
      }
      
      const vehicleNumber = spot.vehicleNumber;
      
      // Update the spot
      const updatedSpot = await storage.updateParkingSpot(spot.id, {
        status: "available",
        vehicleNumber: undefined,
        bookingDuration: undefined,
        bookedAt: undefined
      });
      
      // Log the activity
      await storage.createActivity({
        spotName,
        action: "freed",
        vehicleNumber
      });
      
      res.json(updatedSpot);
    } catch (error) {
      res.status(500).json({ message: "Failed to free parking spot" });
    }
  });
  
  // Get recent activities
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getAllActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  
  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json({ success: true, message: "Contact form submitted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
