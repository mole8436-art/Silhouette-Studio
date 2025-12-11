export type Gender = 'male' | 'female' | 'mixed';

export type BodySize = 'close-up' | 'upper-body' | 'full-body' | 'long-shot';

export type Composition = 'front' | 'side' | 'back' | 'three-quarter' | 'dynamic';

export interface SilhouetteConfig {
  count: number;
  gender: Gender;
  mixedMaleCount: number;
  mixedFemaleCount: number;
  silhouetteColor: string;
  bodySize: BodySize;
  composition: Composition;
  hasLines: boolean;
  lineColor: string;
  extraDetails: string;
}
