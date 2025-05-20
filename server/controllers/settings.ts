import { IStorage } from '../storage';
import { InsertSettings, InsertFamilyMember, InsertMealCalendar } from '@shared/schema';
import { AppSettings } from '@shared/types';

export class SettingsController {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  // Get app settings including family members
  async getAppSettings(): Promise<AppSettings> {
    const settings = await this.storage.getSettings();
    const familyMembers = await this.storage.getFamilyMembers();
    const mealCalendar = await this.storage.getMealCalendar();

    return {
      familyName: settings.familyName,
      timeFormat: settings.timeFormat as ("12" | "24"),
      screensaverTimeout: settings.screensaverTimeout,
      photoDirectory: settings.photoDirectory,
      weatherApiKey: settings.weatherApiKey,
      weatherLocation: settings.weatherLocation,
      tempUnit: settings.tempUnit as ("F" | "C"),
      familyMembers,
      mealCalendarUrl: mealCalendar?.calendarUrl
    };
  }

  // Update app settings
  async updateAppSettings(settingsData: Partial<InsertSettings>): Promise<AppSettings> {
    await this.storage.updateSettings(settingsData);
    return this.getAppSettings();
  }

  // Add family member
  async addFamilyMember(member: InsertFamilyMember) {
    return this.storage.createFamilyMember(member);
  }

  // Update family member
  async updateFamilyMember(id: number, member: Partial<InsertFamilyMember>) {
    return this.storage.updateFamilyMember(id, member);
  }

  // Delete family member
  async deleteFamilyMember(id: number) {
    return this.storage.deleteFamilyMember(id);
  }

  // Set meal calendar
  async setMealCalendar(calendarUrl: string) {
    const mealCalendarData: InsertMealCalendar = {
      calendarUrl,
      active: true
    };
    return this.storage.setMealCalendar(mealCalendarData);
  }
}
