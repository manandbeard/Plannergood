import { pgTable, text, serial, integer, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Family Member Schema
export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(), // Color for the family member's events
  calendarUrl: text("calendar_url").notNull(),
  active: boolean("active").default(true),
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({ 
  id: true 
});

// Meals Calendar Schema
export const mealCalendar = pgTable("meal_calendar", {
  id: serial("id").primaryKey(),
  calendarUrl: text("calendar_url").notNull(),
  active: boolean("active").default(true),
});

export const insertMealCalendarSchema = createInsertSchema(mealCalendar).omit({ 
  id: true 
});



// Tasks Schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({ 
  id: true,
  createdAt: true
});

// Settings Schema
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  familyName: text("family_name").default("Family"),
  timeFormat: text("time_format").default("12"), // 12 or 24
  screensaverTimeout: integer("screensaver_timeout").default(10), // in minutes
  photoDirectory: text("photo_directory").default("./photos"),
  weatherApiKey: text("weather_api_key"),
  weatherLocation: text("weather_location").default("New York,US"),
  tempUnit: text("temp_unit").default("F"), // F or C
  taskCalendarUrl: text("task_calendar_url"), // Todoist or other task management iCal URL
});

export const insertSettingsSchema = createInsertSchema(settings).omit({ 
  id: true 
});

// Photos Schema
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  path: text("path").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({ 
  id: true,
  uploadedAt: true
});

// Type exports
export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type MealCalendar = typeof mealCalendar.$inferSelect;
export type InsertMealCalendar = z.infer<typeof insertMealCalendarSchema>;



export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
