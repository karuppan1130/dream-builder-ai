import { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Home,
  Download,
  Eye,
  EyeOff,
  Layers,
  Play,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Blueprint, Room } from '@/lib/blueprintGenerator';
import { generateBlueprint } from '@/lib/blueprintGenerator';
import * as THREE from 'three';

// Room 3D component
const Room3D = ({ room, floor, showWalls, wallHeight = 3 }: { room: Room; floor: number; showWalls: boolean; wallHeight?: number }) => {
  const yOffset = floor * wallHeight;
  const color = new THREE.Color(room.color);
  
  return (
    <group position={[room.x + room.width / 2, yOffset, room.y + room.height / 2]}>
      {/* Floor */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[room.width, room.height]} />
        <meshStandardMaterial color={color} opacity={0.3} transparent />
      </mesh>
      
      {/* Walls */}
      {showWalls && (
        <>
          {/* Front wall */}
          <mesh position={[0, wallHeight / 2, room.height / 2]} castShadow>
            <boxGeometry args={[room.width, wallHeight, 0.1]} />
            <meshStandardMaterial color={color} opacity={0.6} transparent />
          </mesh>
          {/* Back wall */}
          <mesh position={[0, wallHeight / 2, -room.height / 2]} castShadow>
            <boxGeometry args={[room.width, wallHeight, 0.1]} />
            <meshStandardMaterial color={color} opacity={0.6} transparent />
          </mesh>
          {/* Left wall */}
          <mesh position={[-room.width / 2, wallHeight / 2, 0]} castShadow>
            <boxGeometry args={[0.1, wallHeight, room.height]} />
            <meshStandardMaterial color={color} opacity={0.6} transparent />
          </mesh>
          {/* Right wall */}
          <mesh position={[room.width / 2, wallHeight / 2, 0]} castShadow>
            <boxGeometry args={[0.1, wallHeight, room.height]} />
            <meshStandardMaterial color={color} opacity={0.6} transparent />
          </mesh>
        </>
      )}
      
      {/* Room label */}
      <Text
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </group>
  );
};

// Building 3D component
const Building3D = ({ blueprint, showWalls, visibleFloor }: { blueprint: Blueprint; showWalls: boolean; visibleFloor: number | 'all' }) => {
  const rooms = visibleFloor === 'all' 
    ? blueprint.rooms 
    : blueprint.rooms.filter(r => r.floor === visibleFloor);
  
  return (
    <group position={[-blueprint.landWidth / 2, 0, -blueprint.landLength / 2]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[blueprint.landWidth / 2, 0, blueprint.landLength / 2]} receiveShadow>
        <planeGeometry args={[blueprint.landWidth, blueprint.landLength]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>
      
      {/* Land boundary */}
      <lineSegments position={[blueprint.landWidth / 2, 0.02, blueprint.landLength / 2]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(blueprint.landWidth, blueprint.landLength)]} />
        <lineBasicMaterial color="#3b82f6" />
      </lineSegments>
      
      {/* Rooms */}
      {rooms.map(room => (
        <Room3D key={room.id} room={room} floor={room.floor} showWalls={showWalls} />
      ))}
    </group>
  );
};

const Viewer3D = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const passedBlueprint = location.state?.blueprint as Blueprint | undefined;
  
  const [showWalls, setShowWalls] = useState(true);
  const [visibleFloor, setVisibleFloor] = useState<number | 'all'>('all');
  const [isWalkthroughPlaying, setIsWalkthroughPlaying] = useState(false);

  // Generate demo blueprint if none passed
  const blueprint = useMemo(() => {
    if (passedBlueprint) return passedBlueprint;
    return generateBlueprint({
      projectName: 'Demo Building',
      buildingType: 'house',
      landWidth: 20,
      landLength: 25,
      floors: 2,
      numberOfRooms: 6,
      style: 'modern',
    });
  }, [passedBlueprint]);

  return (
    <div className="min-h-screen bg-[hsl(222,47%,8%)] pt-16 flex flex-col">
      {/* Toolbar */}
      <div className="h-14 border-b border-sidebar-border bg-sidebar px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/editor" state={{ project: { name: blueprint.projectName, buildingType: blueprint.buildingType, landWidth: blueprint.landWidth, landLength: blueprint.landLength, floors: blueprint.floors, style: 'modern' } }}>
            <Button variant="ghost" size="sm" className="gap-2 text-sidebar-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Editor
            </Button>
          </Link>
          <div className="w-px h-6 bg-sidebar-border" />
          <h1 className="text-lg font-semibold text-white">{blueprint.projectName}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Floor selector */}
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sidebar-foreground" />
            <Select value={visibleFloor.toString()} onValueChange={(v) => setVisibleFloor(v === 'all' ? 'all' : Number(v))}>
              <SelectTrigger className="w-28 bg-sidebar-accent border-sidebar-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Floors</SelectItem>
                {Array.from({ length: blueprint.floors }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>Floor {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-px h-6 bg-sidebar-border mx-2" />

          <Button
            variant={showWalls ? "blueprint" : "ghost"}
            size="sm"
            className="gap-2"
            onClick={() => setShowWalls(!showWalls)}
          >
            {showWalls ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {t('viewer.hideWalls')}
          </Button>

          <Button
            variant={isWalkthroughPlaying ? "hero" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setIsWalkthroughPlaying(!isWalkthroughPlaying)}
          >
            <Play className="w-4 h-4" />
            {t('viewer.walkthrough')}
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[30, 25, 30]} fov={50} />
          <OrbitControls 
            enableDamping 
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={100}
            maxPolarAngle={Math.PI / 2.1}
            autoRotate={isWalkthroughPlaying}
            autoRotateSpeed={0.5}
          />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[20, 30, 20]}
            intensity={1}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-far={100}
            shadow-camera-left={-30}
            shadow-camera-right={30}
            shadow-camera-top={30}
            shadow-camera-bottom={-30}
          />
          <pointLight position={[-20, 20, -20]} intensity={0.5} />
          
          {/* Environment */}
          <Environment preset="city" />
          
          {/* Grid */}
          <Grid
            args={[100, 100]}
            cellSize={1}
            cellThickness={0.5}
            cellColor="#1e3a5f"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#3b82f6"
            fadeDistance={100}
            fadeStrength={1}
            followCamera={false}
            position={[0, -0.01, 0]}
          />
          
          {/* Building */}
          <Suspense fallback={null}>
            <Building3D 
              blueprint={blueprint} 
              showWalls={showWalls} 
              visibleFloor={visibleFloor}
            />
          </Suspense>
        </Canvas>

        {/* Controls legend */}
        <div className="absolute bottom-4 left-4 bg-sidebar/90 backdrop-blur-sm rounded-lg p-4 border border-sidebar-border">
          <h3 className="text-sm font-medium text-white mb-2">Controls</h3>
          <div className="space-y-1 text-xs text-sidebar-foreground">
            <div className="flex items-center gap-2">
              <RotateCw className="w-3 h-3" />
              <span>Left click + drag to rotate</span>
            </div>
            <div className="flex items-center gap-2">
              <Move className="w-3 h-3" />
              <span>Right click + drag to pan</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomIn className="w-3 h-3" />
              <span>Scroll to zoom</span>
            </div>
          </div>
        </div>

        {/* Building info */}
        <div className="absolute top-4 right-4 bg-sidebar/90 backdrop-blur-sm rounded-lg p-4 border border-sidebar-border min-w-[200px]">
          <h3 className="text-sm font-medium text-white mb-3">Building Info</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-sidebar-foreground">Land Size</span>
              <span className="text-white font-mono">{blueprint.landWidth}m × {blueprint.landLength}m</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sidebar-foreground">Floors</span>
              <span className="text-white font-mono">{blueprint.floors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sidebar-foreground">Total Rooms</span>
              <span className="text-white font-mono">{blueprint.rooms.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sidebar-foreground">Building Type</span>
              <span className="text-white capitalize">{blueprint.buildingType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer3D;
