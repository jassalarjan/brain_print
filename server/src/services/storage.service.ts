import { nanoid } from 'nanoid';
import { ProfileModel } from '../db/database';
import { FinalScores, UserAnswer } from '../types';

export class StorageService {
  async saveProfile(scores: FinalScores, answers: UserAnswer[]): Promise<string> {
    const profileId = nanoid(10); // Generate short unique ID
    
    const profile = new ProfileModel({
      profileId,
      scores,
      answers,
      createdAt: new Date(),
    });

    await profile.save();
    return profileId;
  }

  async getProfile(profileId: string) {
    const profile = await ProfileModel.findOne({ profileId }).lean();
    
    if (!profile) {
      return null;
    }

    return {
      id: profile.profileId,
      scores: profile.scores,
      answers: profile.answers,
      createdAt: profile.createdAt,
    };
  }
}

export const storageService = new StorageService();
