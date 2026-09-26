// Type definitions for BaGdar Kiosk conforming to docs/api/backend.md

export type Language = 'kk' | 'ru' | 'en' | string;

export type KioskPage =
  | 'sleep'
  | 'greeting'
  | 'listening'
  | 'thinking'
  | 'place'
  | 'route'
  | 'history'
  | 'qr'
  | 'variants'
  | 'nearby'
  | 'help'
  | 'farewell'
  | 'error'
  | 'gestures';


export interface KioskOrigin {
  lat: number;
  lng: number;
  heading_deg: number;
}

export interface KioskConfig {
  screen_id: string;
  origin: KioskOrigin;
  languages: string[];
  default_lang: string;
  modes: {
    voice: boolean;
    tarihsky: boolean;
    qr: boolean;
    huskylens: boolean;
  };
  session: {
    idle_timeout_sec: number;
    qr_timeout_sec: number;
  };
  district: string;
  categories: string[];
}

export interface PlaceTexts {
  name: string;
  summary: string;
  description: string;
  address: string;
}

export interface Place {
  id: number;
  name: string;
  summary: string;
  description?: string;
  category: string;
  lat: number;
  lng: number;
  address?: string;
  thumb_url: string;
  photos?: string[];
  hours: string | null;
  is_open_now?: boolean;
  opens_next?: string | null;
  has_scene: boolean;
  access: 'walk' | 'transit';
  texts?: Record<string, PlaceTexts>;
  // Curated metadata for luxury editorial view
  curatedBadge?: string;
  heroTag?: string;
  rating?: number;
}

export interface RouteStep {
  instruction: string;
  distance_m: number;
}

export interface RouteResponse {
  place_id: number;
  mode: 'walk' | 'transit';
  distance_m: number;
  duration_min: number;
  bearing_deg: number;
  direction_text: string;
  is_approximate: boolean;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [lng, lat]
  };
  steps: RouteStep[];
}

export interface SceneTexts {
  title: string;
  body: string;
}

export interface SceneResponse {
  place_id: number;
  enabled: boolean;
  modern_url: string;
  historic_url: string;
  attribution: string;
  texts: Record<string, SceneTexts>;
  sources: string[];
}

export interface DialogTurnRequest {
  session_id: string;
  lang: string;
  audio_b64?: string;
  mime?: string;
  text?: string;
  context?: {
    screen: string;
    last_place_id: number | null;
  };
}

export interface DialogAction {
  show: 'map' | 'route' | 'scene' | 'qr' | 'sleep';
  place_id?: number;
}

export interface DialogSuggestion {
  id: number;
  name: string;
}

export interface DialogTurnResponse {
  lang: string;
  say: string;
  intent: string;
  place_id?: number | null;
  actions: DialogAction[];
  suggestions: DialogSuggestion[];
  memory_patch?: Record<string, any>;
  debug?: {
    stt_text?: string;
    via?: string;
  };
}

export interface QrResponse {
  url: string;
  payload_version: number;
  expires_in_sec: number;
}
