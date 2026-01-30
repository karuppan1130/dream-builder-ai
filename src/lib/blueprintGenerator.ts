// Blueprint generation logic based on architectural rules

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

export interface ProjectInput {
  projectName: string;
  buildingType: string;
  landWidth: number;
  landLength: number;
  floors: number;
  numberOfRooms: number;
  style: string;
}

// Room type configurations with typical sizes and colors
const ROOM_CONFIGS: Record<string, { minWidth: number; minHeight: number; maxWidth: number; maxHeight: number; color: string; priority: number }> = {
  living: { minWidth: 4, minHeight: 4, maxWidth: 8, maxHeight: 6, color: '#3b82f6', priority: 1 },
  kitchen: { minWidth: 3, minHeight: 3, maxWidth: 5, maxHeight: 4, color: '#f59e0b', priority: 2 },
  bedroom: { minWidth: 3, minHeight: 3, maxWidth: 5, maxHeight: 4, color: '#8b5cf6', priority: 3 },
  bathroom: { minWidth: 2, minHeight: 2, maxWidth: 3, maxHeight: 3, color: '#06b6d4', priority: 4 },
  dining: { minWidth: 3, minHeight: 3, maxWidth: 5, maxHeight: 4, color: '#10b981', priority: 5 },
  office: { minWidth: 2.5, minHeight: 2.5, maxWidth: 4, maxHeight: 4, color: '#6366f1', priority: 6 },
  storage: { minWidth: 1.5, minHeight: 1.5, maxWidth: 3, maxHeight: 3, color: '#78716c', priority: 8 },
  garage: { minWidth: 3, minHeight: 5, maxWidth: 6, maxHeight: 7, color: '#64748b', priority: 7 },
  balcony: { minWidth: 2, minHeight: 1.5, maxWidth: 4, maxHeight: 2, color: '#84cc16', priority: 9 },
  hallway: { minWidth: 1.5, minHeight: 3, maxWidth: 2, maxHeight: 8, color: '#a3a3a3', priority: 10 },
};

// Building type templates
const BUILDING_TEMPLATES: Record<string, string[]> = {
  house: ['living', 'kitchen', 'bedroom', 'bedroom', 'bathroom', 'dining', 'storage'],
  apartment: ['living', 'kitchen', 'bedroom', 'bathroom', 'balcony'],
  office: ['office', 'office', 'office', 'bathroom', 'kitchen', 'storage'],
  hospital: ['office', 'bathroom', 'bathroom', 'storage', 'hallway', 'hallway'],
  school: ['office', 'office', 'bathroom', 'storage', 'hallway'],
  warehouse: ['storage', 'storage', 'storage', 'office', 'bathroom'],
  hotel: ['bedroom', 'bedroom', 'bathroom', 'bathroom', 'living', 'kitchen'],
  restaurant: ['dining', 'dining', 'kitchen', 'kitchen', 'bathroom', 'storage'],
};

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Calculate room dimensions based on available space
const calculateRoomSize = (
  roomType: string,
  availableWidth: number,
  availableHeight: number
): { width: number; height: number } => {
  const config = ROOM_CONFIGS[roomType] || ROOM_CONFIGS.storage;
  
  const width = Math.max(
    config.minWidth,
    Math.min(config.maxWidth, availableWidth * (0.3 + Math.random() * 0.3))
  );
  
  const height = Math.max(
    config.minHeight,
    Math.min(config.maxHeight, availableHeight * (0.3 + Math.random() * 0.3))
  );
  
  return { width: Math.round(width * 10) / 10, height: Math.round(height * 10) / 10 };
};

// Smart room placement algorithm
const placeRooms = (
  roomTypes: string[],
  landWidth: number,
  landLength: number,
  floor: number
): Room[] => {
  const rooms: Room[] = [];
  const margin = 0.5; // Wall thickness
  const usableWidth = landWidth - margin * 2;
  const usableLength = landLength - margin * 2;
  
  // Grid-based placement
  let currentX = margin;
  let currentY = margin;
  let rowHeight = 0;
  
  // Sort by priority
  const sortedRoomTypes = [...roomTypes].sort((a, b) => {
    const priorityA = ROOM_CONFIGS[a]?.priority || 10;
    const priorityB = ROOM_CONFIGS[b]?.priority || 10;
    return priorityA - priorityB;
  });
  
  sortedRoomTypes.forEach((roomType, index) => {
    const config = ROOM_CONFIGS[roomType] || ROOM_CONFIGS.storage;
    const remainingWidth = usableWidth - (currentX - margin);
    const remainingHeight = usableLength - (currentY - margin);
    
    const { width, height } = calculateRoomSize(roomType, remainingWidth, remainingHeight);
    
    // Check if room fits in current row
    if (currentX + width > landWidth - margin) {
      // Move to next row
      currentX = margin;
      currentY += rowHeight + 0.3; // Gap between rows
      rowHeight = 0;
    }
    
    // Check if room fits vertically
    if (currentY + height > landLength - margin) {
      // Scale down or skip
      return;
    }
    
    rooms.push({
      id: generateId(),
      type: roomType,
      name: `${roomType.charAt(0).toUpperCase() + roomType.slice(1)} ${rooms.filter(r => r.type === roomType).length + 1}`,
      x: Math.round(currentX * 10) / 10,
      y: Math.round(currentY * 10) / 10,
      width,
      height,
      floor,
      color: config.color,
    });
    
    currentX += width + 0.3; // Gap between rooms
    rowHeight = Math.max(rowHeight, height);
  });
  
  return rooms;
};

// Main blueprint generation function
export const generateBlueprint = (input: ProjectInput): Blueprint => {
  const { projectName, buildingType, landWidth, landLength, floors, numberOfRooms, style } = input;
  
  // Get base template for building type
  let roomTemplate = BUILDING_TEMPLATES[buildingType] || BUILDING_TEMPLATES.house;
  
  // Adjust number of rooms based on input
  while (roomTemplate.length < numberOfRooms) {
    // Add more bedrooms and bathrooms
    if (roomTemplate.length % 3 === 0) {
      roomTemplate = [...roomTemplate, 'bedroom'];
    } else if (roomTemplate.length % 3 === 1) {
      roomTemplate = [...roomTemplate, 'bathroom'];
    } else {
      roomTemplate = [...roomTemplate, 'storage'];
    }
  }
  
  // Trim if too many
  if (roomTemplate.length > numberOfRooms) {
    roomTemplate = roomTemplate.slice(0, numberOfRooms);
  }
  
  // Generate rooms for each floor
  const allRooms: Room[] = [];
  
  for (let floor = 0; floor < floors; floor++) {
    // First floor typically has living, kitchen, dining
    // Upper floors have bedrooms, bathrooms
    let floorRooms: string[];
    
    if (floor === 0) {
      floorRooms = roomTemplate.filter(r => ['living', 'kitchen', 'dining', 'garage', 'office', 'hallway'].includes(r));
      if (floorRooms.length === 0) {
        floorRooms = roomTemplate.slice(0, Math.ceil(roomTemplate.length / floors));
      }
    } else {
      floorRooms = roomTemplate.filter(r => ['bedroom', 'bathroom', 'office', 'balcony', 'storage'].includes(r));
      if (floorRooms.length === 0) {
        floorRooms = roomTemplate.slice(Math.ceil(roomTemplate.length / floors));
      }
    }
    
    const placedRooms = placeRooms(floorRooms, landWidth, landLength, floor);
    allRooms.push(...placedRooms);
  }
  
  return {
    id: generateId(),
    projectName,
    buildingType,
    landWidth,
    landLength,
    floors,
    rooms: allRooms,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Convert blueprint to SVG
export const blueprintToSVG = (blueprint: Blueprint, scale: number = 40): string => {
  const { landWidth, landLength, rooms } = blueprint;
  const svgWidth = landWidth * scale;
  const svgHeight = landLength * scale;
  const padding = 20;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth + padding * 2} ${svgHeight + padding * 2}" width="${svgWidth + padding * 2}" height="${svgHeight + padding * 2}">`;
  
  // Background
  svg += `<rect x="0" y="0" width="${svgWidth + padding * 2}" height="${svgHeight + padding * 2}" fill="#0c1929"/>`;
  
  // Grid pattern
  svg += `<defs>
    <pattern id="grid" width="${scale}" height="${scale}" patternUnits="userSpaceOnUse">
      <path d="M ${scale} 0 L 0 0 0 ${scale}" fill="none" stroke="#1e3a5f" stroke-width="0.5"/>
    </pattern>
  </defs>`;
  
  svg += `<rect x="${padding}" y="${padding}" width="${svgWidth}" height="${svgHeight}" fill="url(#grid)" stroke="#3b82f6" stroke-width="2"/>`;
  
  // Rooms (filter by floor 0 for main view)
  const floor0Rooms = rooms.filter(r => r.floor === 0);
  
  floor0Rooms.forEach(room => {
    const x = padding + room.x * scale;
    const y = padding + room.y * scale;
    const w = room.width * scale;
    const h = room.height * scale;
    
    // Room rectangle
    svg += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${room.color}20" stroke="${room.color}" stroke-width="2" rx="2"/>`;
    
    // Room label
    const fontSize = Math.min(14, Math.max(10, w / 8));
    svg += `<text x="${x + w / 2}" y="${y + h / 2}" fill="#e2e8f0" font-family="Inter, sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${room.name}</text>`;
    
    // Dimensions
    svg += `<text x="${x + w / 2}" y="${y + h - 8}" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">${room.width}m × ${room.height}m</text>`;
  });
  
  // Compass rose
  svg += `<g transform="translate(${svgWidth + padding - 30}, ${padding + 30})">
    <circle cx="0" cy="0" r="20" fill="none" stroke="#f59e0b" stroke-width="1"/>
    <text x="0" y="-25" fill="#f59e0b" font-family="Inter, sans-serif" font-size="12" text-anchor="middle">N</text>
    <polygon points="0,-15 5,-5 0,-8 -5,-5" fill="#f59e0b"/>
  </g>`;
  
  // Scale bar
  svg += `<g transform="translate(${padding}, ${svgHeight + padding + 15})">
    <line x1="0" y1="0" x2="${scale * 5}" y2="0" stroke="#94a3b8" stroke-width="2"/>
    <line x1="0" y1="-5" x2="0" y2="5" stroke="#94a3b8" stroke-width="2"/>
    <line x1="${scale * 5}" y1="-5" x2="${scale * 5}" y2="5" stroke="#94a3b8" stroke-width="2"/>
    <text x="${scale * 2.5}" y="15" fill="#94a3b8" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">5 meters</text>
  </g>`;
  
  svg += '</svg>';
  
  return svg;
};

// Export blueprint as downloadable SVG file
export const downloadBlueprintSVG = (blueprint: Blueprint, filename: string = 'blueprint.svg') => {
  const svgContent = blueprintToSVG(blueprint);
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
