// Blueprint and project types

export interface Room {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floor: number;
  color: string;
}

export interface Blueprint {
  id: string;
  projectName: string;
  buildingType: string;
  landWidth: number;
  landLength: number;
  floors: number;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  buildingType: string;
  landWidth: number;
  landLength: number;
  floors: number;
  style: string;
  status: 'draft' | 'in_progress' | 'completed';
  blueprint?: Blueprint;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'builder' | 'client' | 'architect';
  avatar?: string;
}

export type BuildingType = 
  | 'house'
  | 'apartment'
  | 'office'
  | 'hospital'
  | 'school'
  | 'warehouse'
  | 'hotel'
  | 'restaurant';

export type ArchitecturalStyle = 
  | 'modern'
  | 'traditional'
  | 'minimalist'
  | 'industrial';

export type RoomType = 
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'living'
  | 'dining'
  | 'office'
  | 'storage'
  | 'garage'
  | 'balcony'
  | 'hallway';
