import { IStorage } from '../storage';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { InsertPhoto } from '@shared/schema';

export class PhotoController {
  private storage: IStorage;

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  // Get all photos
  async getAllPhotos() {
    return this.storage.getPhotos();
  }

  // Save uploaded photo
  async savePhoto(file: Express.Multer.File) {
    try {
      const settings = await this.storage.getSettings();
      const photoDir = settings.photoDirectory;

      // Create photo directory if it doesn't exist
      if (!fs.existsSync(photoDir)) {
        fs.mkdirSync(photoDir, { recursive: true });
      }

      // Generate unique filename
      const extension = path.extname(file.originalname);
      const filename = `${randomUUID()}${extension}`;
      const photoPath = path.join(photoDir, filename);

      // Write file to disk
      fs.writeFileSync(photoPath, file.buffer);

      // Save photo record to storage
      const photoData: InsertPhoto = {
        filename,
        path: photoPath
      };

      return await this.storage.createPhoto(photoData);
    } catch (error) {
      console.error('Failed to save photo:', error);
      throw error;
    }
  }

  // Delete a photo
  async deletePhoto(id: number) {
    return this.storage.deletePhoto(id);
  }
}
