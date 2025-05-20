import { 
  FamilyMember, InsertFamilyMember,
  MealCalendar, InsertMealCalendar,
  TaskCalendar, InsertTaskCalendar,
  Task, InsertTask, 
  Settings, InsertSettings,
  Photo, InsertPhoto
} from '@shared/schema';
import fs from 'fs';
import path from 'path';
import { DayEvents, CalendarEvent, MealEvent, WeatherData } from '@shared/types';

// Define the storage interface
export interface IStorage {
  // Family Members
  getFamilyMembers(): Promise<FamilyMember[]>;
  getFamilyMember(id: number): Promise<FamilyMember | undefined>;
  createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, member: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined>;
  deleteFamilyMember(id: number): Promise<boolean>;

  // Meal Calendar
  getMealCalendar(): Promise<MealCalendar | undefined>;
  setMealCalendar(mealCalendar: InsertMealCalendar): Promise<MealCalendar>;
  


  // Tasks
  getTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;

  // Settings
  getSettings(): Promise<Settings>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  // Photos
  getPhotos(): Promise<Photo[]>;
  getPhoto(id: number): Promise<Photo | undefined>;
  createPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: number): Promise<boolean>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private familyMembers: Map<number, FamilyMember>;
  private mealCalendar: MealCalendar | undefined;
  private taskCalendar: TaskCalendar | undefined;
  private tasks: Map<number, Task>;
  private settings: Settings;
  private photos: Map<number, Photo>;
  private currentMemberId: number;
  private currentTaskId: number;
  private currentPhotoId: number;
  private configFile: string;

  constructor() {
    this.configFile = path.resolve(process.cwd(), 'family_calendar_config.json');
    this.familyMembers = new Map();
    this.tasks = new Map();
    this.photos = new Map();
    this.currentMemberId = 1;
    this.currentTaskId = 1;
    this.currentPhotoId = 1;
    
    // Default settings
    this.settings = {
      id: 1,
      familyName: "Helland Family",
      timeFormat: "12",
      screensaverTimeout: 10,
      photoDirectory: "./photos",
      weatherApiKey: null,
      weatherLocation: "New York,US",
      tempUnit: "F"
    };

    // Try to load from config file
    this.loadFromFile();
  }

  // Persist data to JSON file
  private persist(): void {
    const data = {
      familyMembers: Array.from(this.familyMembers.values()),
      mealCalendar: this.mealCalendar,
      tasks: Array.from(this.tasks.values()),
      settings: this.settings,
      photos: Array.from(this.photos.values()),
      counters: {
        memberId: this.currentMemberId,
        taskId: this.currentTaskId,
        photoId: this.currentPhotoId
      }
    };

    try {
      fs.writeFileSync(this.configFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save config file:', error);
    }
  }

  // Load data from JSON file
  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        
        this.familyMembers = new Map();
        data.familyMembers?.forEach((member: FamilyMember) => {
          this.familyMembers.set(member.id, member);
        });

        this.mealCalendar = data.mealCalendar;

        this.tasks = new Map();
        data.tasks?.forEach((task: Task) => {
          // Convert string dates to Date objects
          if (typeof task.createdAt === 'string') {
            task.createdAt = new Date(task.createdAt);
          }
          this.tasks.set(task.id, task);
        });

        if (data.settings) {
          this.settings = data.settings;
        }

        this.photos = new Map();
        data.photos?.forEach((photo: Photo) => {
          // Convert string dates to Date objects
          if (typeof photo.uploadedAt === 'string') {
            photo.uploadedAt = new Date(photo.uploadedAt);
          }
          this.photos.set(photo.id, photo);
        });

        // Restore ID counters
        if (data.counters) {
          this.currentMemberId = data.counters.memberId || 1;
          this.currentTaskId = data.counters.taskId || 1;
          this.currentPhotoId = data.counters.photoId || 1;
        }
      }
    } catch (error) {
      console.error('Failed to load config file:', error);
    }
  }

  // Family Members methods
  async getFamilyMembers(): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values());
  }

  async getFamilyMember(id: number): Promise<FamilyMember | undefined> {
    return this.familyMembers.get(id);
  }

  async createFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const id = this.currentMemberId++;
    const newMember: FamilyMember = { 
      id, 
      ...member,
      active: member.active !== undefined ? member.active : true
    };
    this.familyMembers.set(id, newMember);
    this.persist();
    return newMember;
  }

  async updateFamilyMember(id: number, member: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined> {
    const existingMember = this.familyMembers.get(id);
    if (!existingMember) return undefined;

    const updatedMember = { ...existingMember, ...member };
    this.familyMembers.set(id, updatedMember);
    this.persist();
    return updatedMember;
  }

  async deleteFamilyMember(id: number): Promise<boolean> {
    const success = this.familyMembers.delete(id);
    if (success) this.persist();
    return success;
  }

  // Meal Calendar methods
  async getMealCalendar(): Promise<MealCalendar | undefined> {
    return this.mealCalendar;
  }

  async setMealCalendar(mealCalendar: InsertMealCalendar): Promise<MealCalendar> {
    this.mealCalendar = { 
      id: 1, 
      calendarUrl: mealCalendar.calendarUrl,
      active: mealCalendar.active ?? true
    };
    this.persist();
    return this.mealCalendar;
  }

  // Tasks methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.currentTaskId++;
    const newTask: Task = { 
      id, 
      title: task.title,
      description: task.description || null,
      completed: task.completed || false,
      createdAt: new Date() 
    };
    this.tasks.set(id, newTask);
    this.persist();
    return newTask;
  }

  async updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) return undefined;

    const updatedTask = { ...existingTask, ...task };
    this.tasks.set(id, updatedTask);
    this.persist();
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const success = this.tasks.delete(id);
    if (success) this.persist();
    return success;
  }

  // Settings methods
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(settings: Partial<InsertSettings>): Promise<Settings> {
    this.settings = { ...this.settings, ...settings };
    this.persist();
    return this.settings;
  }

  // Photos methods
  async getPhotos(): Promise<Photo[]> {
    return Array.from(this.photos.values());
  }

  async getPhoto(id: number): Promise<Photo | undefined> {
    return this.photos.get(id);
  }

  async createPhoto(photo: InsertPhoto): Promise<Photo> {
    const id = this.currentPhotoId++;
    const newPhoto: Photo = { 
      id, 
      ...photo, 
      uploadedAt: new Date() 
    };
    this.photos.set(id, newPhoto);
    this.persist();
    return newPhoto;
  }

  async deletePhoto(id: number): Promise<boolean> {
    const photo = this.photos.get(id);
    if (photo) {
      try {
        // Delete the actual file
        fs.unlinkSync(photo.path);
      } catch (error) {
        console.error('Failed to delete photo file:', error);
      }
    }
    
    const success = this.photos.delete(id);
    if (success) this.persist();
    return success;
  }
}

// Create and export storage instance
export const storage = new MemStorage();
