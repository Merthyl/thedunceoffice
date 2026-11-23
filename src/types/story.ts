export type MapScope = 'valeroth' | 'norsvale';

export type LocationStatus = 'visited' | 'current' | 'unexplored' | 'locked';

export interface StoryLocation {
  id: string;
  name: string;
  altName?: string;
  region: string;
  ruler?: string;
  summary?: string;
  /** Which map layer this location belongs to (defaults to 'valeroth') */
  scope?: MapScope;
  status: LocationStatus;
  /** Map coordinate X in [0..1000] */
  x: number;
  /** Map coordinate Y in [0..562] */
  y: number;
  /** SVG path d="" defining the demarcated territorial boundary (khoanh vùng) */
  zonePath?: string;
  /** Softer blended edge for zones that merge organically (e.g. Cấm Địa & U Lâm) */
  softBlend?: boolean;
  /** Display name label only on the map; non-clickable (does not open detail inspector) */
  labelOnly?: boolean;
}

export interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  locationId: string;
  status: string;
  isPlayer?: boolean;
}

export interface StoryWorldState {
  title: string;
  activeMapScope?: MapScope;
  playerLocationId?: string;
  playerStatus?: string;
  locations: StoryLocation[];
  characters: StoryCharacter[];
}
