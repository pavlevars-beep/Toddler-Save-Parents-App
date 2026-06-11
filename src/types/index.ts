export type ActivityMode = 'animals' | 'colors' | 'bigsmall' | 'explorer' | 'mixed';
export type SessionLength = 5 | 10 | 15 | 20;

export interface AppSettings {
  soundEnabled: boolean;
  activityMode: ActivityMode;
  sessionLength: SessionLength;
  calmEnding: boolean;
  restaurantMode: boolean;
}

export type AppScreen =
  | 'home'
  | 'activity'
  | 'session-end'
  | 'parent';

export type AnimalId = 'cat' | 'dog' | 'cow' | 'sheep' | 'duck';
export type ColorId = 'red' | 'blue' | 'yellow' | 'green';
