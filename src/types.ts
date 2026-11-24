export type ColorPair = [string, string];

export type VehicleClass =
  | "Muscle"
  | "Super"
  | "Sports"
  | "Sedan"
  | "SUV"
  | "Off-road"
  | "Boat"
  | "Helicopter"
  | "Motorcycle"
  | "Commercial";

export interface Vehicle {
  name: string;
  cls: VehicleClass;
  maker: string;
  speed: number;
  handling: number;
  price: string;
  tags: string[];
  color: ColorPair;
  image: string;
}

export interface Character {
  name: string;
  role: string;
  bio: string;
  initials: string;
  color: ColorPair;
  stats: Record<string, number>;
  image: string;
}

export interface MapLocation {
  name: string;
  region: string;
  x: number;
  y: number;
  icon: string;
  desc: string;
  image: string;
}

export interface Weapon {
  name: string;
  cat: string;
  dmg: number;
  rate: number;
  range: number;
  desc: string;
  image: string;
}

export interface NewsItem {
  title: string;
  cat: string;
  date: string;
  read: string;
  excerpt: string;
  image: string;
  color: ColorPair;
  glyph: string;
}

export interface Cheat {
  code: string;
  platform: string;
  effect: string;
}

export type ResourceTag = "free" | "freemium";

export interface ResourceItem {
  name: string;
  fa: string;
  desc: string;
  url: string;
  license: string;
  tag: ResourceTag;
}

export interface ResourceCategory {
  id: string;
  title: string;
  icon: string;
  color: ColorPair;
  image: string;
  items: ResourceItem[];
}

export interface HubSection {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  tag: string;
}

export interface SiteMeta {
  game: string;
  state: string;
  city: string;
  release: string;
  platforms: string[];
  studio: string;
}

/* ---- community map datasets (assets/data/*.json) ---- */

export interface MapPlace {
  id: string;
  name: string;
  kind: string;
  area?: string;
  x: number;
  y: number;
  real_life?: string;
  service?: string;
  confidence?: "community" | "press" | "unverified";
  source_urls?: string[];
}

export interface MapDistrict {
  name: string;
  rings?: [number, number][][];
}

export interface PlacesFile {
  places: MapPlace[];
}

export interface DistrictsFile {
  districts: MapDistrict[];
}
