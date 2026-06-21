export type AvatarId = 'panda' | 'rabbit' | 'lion' | 'owl';

export interface Character {
  id: AvatarId;
  name: string;
  avatar: string; // Emoji or SVG
  color: string;
  intro: string;
}

export interface UserProgress {
  characterId: AvatarId | null;
  nickname: string;
  points: number;
  unlockedLevels: Record<string, boolean>;
  solvedQuestions: Record<string, string[]>; // gameId -> solvedQuestionIds
  unlockedStickers: string[];
  stars?: number; // Earned stars for Gardenscapes decoration
  gardenDecorations?: string[]; // IDs of unlocked garden decorations
  petAdoptState?: UserPetState | null; // pet details
  foodCount?: number; // available pet food units
}

export interface UserPetState {
  templateId: string;
  customName: string;
  level: number;
  exp: number; // 0 to 100% to grow
  lastFedDate: string | null; // daily tracking
  clockedInDates: string[]; // dates when learning check-in was clicked
}

export interface PetTemplate {
  id: string;
  name: string;
  emoji: string;
  intro: string;
  color: string;
  favoriteFoodName: string;
  favoriteFoodEmoji: string;
  favGreeting: string;
}

export interface GardenItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  unlockedLevelMsg: string;
}

export type SubjectCategory = 'pinyin' | 'math' | 'logic' | 'school-life';

export interface GameLevel {
  id: string;
  title: string;
  category: SubjectCategory;
  description: string;
  starsRequired: number;
  pointsReward: number;
}

export interface Sticker {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  category: SubjectCategory | 'general';
}
