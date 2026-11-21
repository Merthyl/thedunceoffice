export type MapScope = 'valeroth' | 'norsvale';

export type LocationType = 'city' | 'port' | 'landmark' | 'ruins' | 'camp' | 'mystery';

export type LocationStatus = 'visited' | 'current' | 'unexplored' | 'locked';

export type RouteType = 'road' | 'sea' | 'secret' | 'portal';

export type RouteStatus = 'open' | 'traversed' | 'blocked';

export interface StoryLocation {
  id: string;
  name: string;
  altName?: string;
  region: string;
  ruler?: string;
  /** Which map layer this location belongs to (defaults to 'valeroth') */
  scope?: MapScope;
  type: LocationType;
  status: LocationStatus;
  /** Map coordinate X in [0..1000] */
  x: number;
  /** Map coordinate Y in [0..562] */
  y: number;
  /** Optional SVG path d="" defining the demarcated territorial boundary (khoanh vùng) */
  zonePath?: string;
  /** If true, renders a softer blended edge for zones that merge organically (e.g. Cấm Địa & U Lâm) */
  softBlend?: boolean;
  chapter: number;
  summary: string;
}

export interface StoryRoute {
  id: string;
  fromId: string;
  toId: string;
  label: string;
  scope?: MapScope;
  type: RouteType;
  status: RouteStatus;
}

export interface StoryCharacter {
  id: string;
  name: string;
  role: string;
  locationId: string;
  status: string;
  isParty?: boolean;
  /** Marks the user / player character tracked by /map */
  isPlayer?: boolean;
}

export interface StoryEvent {
  id: string;
  chapter: number;
  title: string;
  description: string;
  locationId: string;
  timestampLabel: string;
}

export interface StoryWorldState {
  title: string;
  premise: string;
  currentChapter: number;
  activeMapScope?: MapScope;
  /** Current location ID of the user/player character for /map tracking */
  playerLocationId?: string;
  /** Latest narrative situation of the user/player at their current position */
  playerStatus?: string;
  loreDirectives?: string;
  locations: StoryLocation[];
  routes: StoryRoute[];
  characters: StoryCharacter[];
  events: StoryEvent[];
}

export interface ToolCallTrace {
  id: string;
  name: string;
  args: Record<string, unknown>;
  result: Record<string, unknown>;
  summary: string;
  affectedLocationIds?: string[];
  switchScope?: MapScope;
  showPlayerMap?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  toolTrace?: ToolCallTrace[];
  isError?: boolean;
}
