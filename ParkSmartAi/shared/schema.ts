import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Parking spot schema
export const parkingSpots = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  spotName: text("spot_name").notNull(),
  status: text("status").notNull().default("available"), // available, occupied, reserved
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  vehicleNumber: text("vehicle_number"),
  bookedAt: timestamp("booked_at"),
  bookingDuration: integer("booking_duration"), // in minutes
});

export const insertParkingSpotSchema = createInsertSchema(parkingSpots).pick({
  spotName: true,
  status: true,
  vehicleNumber: true,
  bookingDuration: true,
});

export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;
export type ParkingSpot = typeof parkingSpots.$inferSelect;

// Recent activity schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  spotName: text("spot_name").notNull(),
  action: text("action").notNull(), // booked, freed, expired
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  vehicleNumber: text("vehicle_number"),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  spotName: true,
  action: true,
  vehicleNumber: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Contact form schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  message: true,
});

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

// Booking schema for validating booking requests
export const bookSpotSchema = z.object({
  spotName: z.string(),
  vehicleNumber: z.string(),
  duration: z.number()
});

export type BookSpot = z.infer<typeof bookSpotSchema>;
