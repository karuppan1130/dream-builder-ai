import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Download,
  Save,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Box,
  Move,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateBlueprint, downloadBlueprintSVG, type Blueprint, type Room } from '@/lib/blueprintGenerator';
import type { Project } from '@/types/blueprint';

const ROOM_TYPES = [
  { value: 'bedroom', color: '#8b5cf6' },
  { value: 'bathroom', color: '#06b6d4' },
  { value: 'kitchen', color: '#f59e0b' },
  { value: 'living', color: '#3b82f6' },
  { value: 'dining', color: '#10b981' },
  { value: 'office', color: '#6366f1' },
  { value: 'storage', color: '#78716c' },
  { value: 'garage', color: '#64748b' },
  { value: 'balcony', color: '#84cc16' },
  { value: 'hallway', color: '#a3a3a3' },
];

const BlueprintEditor = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project as Project | undefined;

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<Blueprint[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ roomId: string; startX: number; startY: number; roomStartX: number; roomStartY: number } | null>(null);
  const resizeRef = useRef<{ roomId: string; corner: string; startX: number; startY: number; roomStartW: number; roomStartH: number } | null>(null);

  const SCALE = 40; // pixels per meter

  // Initialize blueprint
  useEffect(() => {
    if (project) {
      const generatedBlueprint = generateBlueprint({
        projectName: project.name,
        buildingType: project.buildingType,
        landWidth: project.landWidth,
        landLength: project.landLength,
        floors: project.floors,
        numberOfRooms: 5,
        style: project.style,
      });
      setBlueprint(generatedBlueprint);
      saveToHistory(generatedBlueprint);
    } else {
      // Default blueprint for demo
      const defaultBlueprint = generateBlueprint({
        projectName: 'Demo Project',
        buildingType: 'house',
        landWidth: 20,
        landLength: 25,
        floors: 2,
        numberOfRooms: 6,
        style: 'modern',
      });
      setBlueprint(defaultBlueprint);
      saveToHistory(defaultBlueprint);
    }
  }, [project]);

  const saveToHistory = useCallback((bp: Blueprint) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, JSON.parse(JSON.stringify(bp))];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setBlueprint(JSON.parse(JSON.stringify(history[historyIndex - 1])));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setBlueprint(JSON.parse(JSON.stringify(history[historyIndex + 1])));
    }
  };

  const currentFloorRooms = blueprint?.rooms.filter(r => r.floor === currentFloor) || [];

  const handleRoomMouseDown = (e: React.MouseEvent, room: Room) => {
    e.stopPropagation();
    setSelectedRoom(room.id);
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragRef.current = {
      roomId: room.id,
      startX: e.clientX,
      startY: e.clientY,
      roomStartX: room.x,
      roomStartY: room.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!blueprint) return;

    if (dragRef.current) {
      const dx = (e.clientX - dragRef.current.startX) / (SCALE * zoom);
      const dy = (e.clientY - dragRef.current.startY) / (SCALE * zoom);

      setBlueprint(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rooms: prev.rooms.map(r => 
            r.id === dragRef.current?.roomId
              ? { 
                  ...r, 
                  x: Math.max(0.5, Math.min(prev.landWidth - r.width - 0.5, dragRef.current.roomStartX + dx)),
                  y: Math.max(0.5, Math.min(prev.landLength - r.height - 0.5, dragRef.current.roomStartY + dy)),
                }
              : r
          ),
        };
      });
    }

    if (resizeRef.current) {
      const dx = (e.clientX - resizeRef.current.startX) / (SCALE * zoom);
      const dy = (e.clientY - resizeRef.current.startY) / (SCALE * zoom);

      setBlueprint(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          rooms: prev.rooms.map(r => {
            if (r.id !== resizeRef.current?.roomId) return r;
            
            let newWidth = resizeRef.current.roomStartW;
            let newHeight = resizeRef.current.roomStartH;

            if (resizeRef.current.corner.includes('e')) newWidth += dx;
            if (resizeRef.current.corner.includes('s')) newHeight += dy;
            if (resizeRef.current.corner.includes('w')) newWidth -= dx;
            if (resizeRef.current.corner.includes('n')) newHeight -= dy;

            return {
              ...r,
              width: Math.max(1.5, Math.min(15, newWidth)),
              height: Math.max(1.5, Math.min(15, newHeight)),
            };
          }),
        };
      });
    }

    if (isPanning) {
      setPanOffset(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const handleMouseUp = () => {
    if (dragRef.current || resizeRef.current) {
      if (blueprint) saveToHistory(blueprint);
    }
    dragRef.current = null;
    resizeRef.current = null;
    setIsPanning(false);
  };

  const handleResizeStart = (e: React.MouseEvent, room: Room, corner: string) => {
    e.stopPropagation();
    setSelectedRoom(room.id);
    
    resizeRef.current = {
      roomId: room.id,
      corner,
      startX: e.clientX,
      startY: e.clientY,
      roomStartW: room.width,
      roomStartH: room.height,
    };
  };

  const addRoom = (type: string) => {
    if (!blueprint) return;

    const config = ROOM_TYPES.find(r => r.value === type);
    const newRoom: Room = {
      id: Math.random().toString(36).substring(2, 11),
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${currentFloorRooms.filter(r => r.type === type).length + 1}`,
      x: 2,
      y: 2,
      width: 3,
      height: 3,
      floor: currentFloor,
      color: config?.color || '#888',
    };

    const newBlueprint = {
      ...blueprint,
      rooms: [...blueprint.rooms, newRoom],
    };
    setBlueprint(newBlueprint);
    saveToHistory(newBlueprint);
    setSelectedRoom(newRoom.id);
  };

  const deleteRoom = () => {
    if (!blueprint || !selectedRoom) return;

    const newBlueprint = {
      ...blueprint,
      rooms: blueprint.rooms.filter(r => r.id !== selectedRoom),
    };
    setBlueprint(newBlueprint);
    saveToHistory(newBlueprint);
    setSelectedRoom(null);
  };

  const updateRoomName = (name: string) => {
    if (!blueprint || !selectedRoom) return;

    setBlueprint(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        rooms: prev.rooms.map(r => r.id === selectedRoom ? { ...r, name } : r),
      };
    });
  };

  const updateRoomType = (type: string) => {
    if (!blueprint || !selectedRoom) return;

    const config = ROOM_TYPES.find(r => r.value === type);
    setBlueprint(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        rooms: prev.rooms.map(r => 
          r.id === selectedRoom ? { ...r, type, color: config?.color || r.color } : r
        ),
      };
    });
  };

  const selectedRoomData = blueprint?.rooms.find(r => r.id === selectedRoom);

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Generating blueprint...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16 flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        className="bg-card border-r border-border flex-shrink-0 overflow-hidden"
      >
        <div className="w-[280px] h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-card-foreground">{t('editor.rooms')}</h2>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {currentFloorRooms.map(room => (
              <motion.button
                key={room.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedRoom(room.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedRoom === room.id
                    ? 'bg-accent/20 border border-accent'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: room.color }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm text-card-foreground">{room.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {room.width}m × {room.height}m
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Add Room */}
          <div className="p-4 border-t border-border">
            <Label className="text-xs text-muted-foreground mb-2 block">{t('editor.addRoom')}</Label>
            <Select onValueChange={addRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {ROOM_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: type.color }} />
                      {t(`editor.roomTypes.${type.value}`)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Room Editor */}
          {selectedRoomData && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Room Name</Label>
                <Input
                  value={selectedRoomData.name}
                  onChange={(e) => updateRoomName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Room Type</Label>
                <Select value={selectedRoomData.type} onValueChange={updateRoomType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {t(`editor.roomTypes.${type.value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" size="sm" className="w-full gap-2" onClick={deleteRoom}>
                <Trash2 className="w-4 h-4" />
                {t('editor.deleteRoom')}
              </Button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card border border-border rounded-r-lg p-2 hover:bg-muted transition-colors"
        style={{ left: sidebarOpen ? 280 : 0 }}
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(2, z + 0.1))}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <span className="text-sm font-mono text-muted-foreground w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <Button
              variant={isPanning ? "blueprint" : "ghost"}
              size="icon"
              onClick={() => setIsPanning(!isPanning)}
            >
              <Move className="w-4 h-4" />
            </Button>
          </div>

          {/* Floor Selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Floor:</span>
            <Select value={currentFloor.toString()} onValueChange={(v) => setCurrentFloor(Number(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: blueprint.floors }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    Floor {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadBlueprintSVG(blueprint, `${blueprint.projectName}.svg`)}>
              <Download className="w-4 h-4" />
              {t('editor.export')}
            </Button>
            <Link to="/viewer" state={{ blueprint }}>
              <Button variant="blueprint" size="sm" className="gap-2">
                <Box className="w-4 h-4" />
                {t('editor.view3d')}
              </Button>
            </Link>
            <Button variant="hero" size="sm" className="gap-2">
              <Save className="w-4 h-4" />
              {t('editor.save')}
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
          className="flex-1 overflow-hidden bg-[hsl(216,50%,12%)] blueprint-grid-fine cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isPanning ? 'grab' : 'crosshair' }}
        >
          <div
            className="relative"
            style={{
              transform: `translate(${panOffset.x + 40}px, ${panOffset.y + 40}px) scale(${zoom})`,
              transformOrigin: 'top left',
            }}
          >
            {/* Land boundary */}
            <div
              className="absolute border-2 border-[hsl(199,89%,48%)] rounded-sm"
              style={{
                width: blueprint.landWidth * SCALE,
                height: blueprint.landLength * SCALE,
              }}
            >
              {/* Grid lines */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ width: blueprint.landWidth * SCALE, height: blueprint.landLength * SCALE }}
              >
                {/* Vertical lines */}
                {Array.from({ length: Math.floor(blueprint.landWidth) + 1 }, (_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * SCALE}
                    y1={0}
                    x2={i * SCALE}
                    y2={blueprint.landLength * SCALE}
                    stroke="hsl(216, 40%, 25%)"
                    strokeWidth={i % 5 === 0 ? 1 : 0.5}
                  />
                ))}
                {/* Horizontal lines */}
                {Array.from({ length: Math.floor(blueprint.landLength) + 1 }, (_, i) => (
                  <line
                    key={`h-${i}`}
                    x1={0}
                    y1={i * SCALE}
                    x2={blueprint.landWidth * SCALE}
                    y2={i * SCALE}
                    stroke="hsl(216, 40%, 25%)"
                    strokeWidth={i % 5 === 0 ? 1 : 0.5}
                  />
                ))}
              </svg>

              {/* Rooms */}
              {currentFloorRooms.map(room => (
                <motion.div
                  key={room.id}
                  className={`absolute cursor-move ${selectedRoom === room.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-[hsl(216,50%,12%)]' : ''}`}
                  style={{
                    left: room.x * SCALE,
                    top: room.y * SCALE,
                    width: room.width * SCALE,
                    height: room.height * SCALE,
                    backgroundColor: `${room.color}30`,
                    border: `2px solid ${room.color}`,
                    borderRadius: 4,
                  }}
                  onMouseDown={(e) => handleRoomMouseDown(e, room)}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Room label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                    <span className="text-sm font-medium truncate max-w-full px-1">{room.name}</span>
                    <span className="text-xs opacity-70 font-mono">{room.width}m × {room.height}m</span>
                  </div>

                  {/* Resize handles */}
                  {selectedRoom === room.id && (
                    <>
                      <div
                        className="absolute -right-1.5 -bottom-1.5 w-3 h-3 bg-accent rounded-full cursor-se-resize"
                        onMouseDown={(e) => handleResizeStart(e, room, 'se')}
                      />
                      <div
                        className="absolute -left-1.5 -bottom-1.5 w-3 h-3 bg-accent rounded-full cursor-sw-resize"
                        onMouseDown={(e) => handleResizeStart(e, room, 'sw')}
                      />
                      <div
                        className="absolute -right-1.5 -top-1.5 w-3 h-3 bg-accent rounded-full cursor-ne-resize"
                        onMouseDown={(e) => handleResizeStart(e, room, 'ne')}
                      />
                      <div
                        className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-accent rounded-full cursor-nw-resize"
                        onMouseDown={(e) => handleResizeStart(e, room, 'nw')}
                      />
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Dimension labels */}
            <div
              className="absolute -top-6 left-0 text-xs font-mono text-[hsl(199,89%,70%)]"
              style={{ width: blueprint.landWidth * SCALE }}
            >
              <div className="flex justify-between">
                <span>0m</span>
                <span>{blueprint.landWidth}m</span>
              </div>
            </div>
            <div
              className="absolute top-0 -left-6 text-xs font-mono text-[hsl(199,89%,70%)] flex flex-col justify-between"
              style={{ height: blueprint.landLength * SCALE }}
            >
              <span>0m</span>
              <span>{blueprint.landLength}m</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintEditor;
