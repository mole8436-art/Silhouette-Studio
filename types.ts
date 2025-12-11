export type Gender = 'male' | 'female' | 'mixed';

export type BodySize = 'close-up' | 'upper-body' | 'full-body' | 'long-shot';

export interface SilhouetteConfig {
  count: number;
  gender: Gender;
  mixedMaleCount: number;
  mixedFemaleCount: number;
  silhouetteColor: string;
  bodySize: BodySize;
  hasLines: boolean;
  lineColor: string;
  extraDetails: string;
}

export interface GenerationResult {
  imageUrl: string | null;
  promptUsed: string;
  loading: boolean;
  error: string | null;
}
