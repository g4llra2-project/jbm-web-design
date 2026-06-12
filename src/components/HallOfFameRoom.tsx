import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { 
  X, MessageCircle, MapPin, Star, Award, 
  ZoomIn, ZoomOut, RotateCcw, Hand, Eye
} from 'lucide-react';
import { HallOfFameItem } from '../types';
import { optimizeImageUrl } from '../utils/imageOptimizer';

interface HallOfFameRoomProps {
  hallOfFameItems: HallOfFameItem[];
  setActiveTab: (tab: string) => void;
}

// Spherical Constants
const ROWS = 4;
const COLS = 20;
const TOTAL_NODES = ROWS * COLS; // 80 positions
const SPHERE_RADIUS = 20.0;      // Inside-Out: spacious radius
const BEND_RADIUS = 6.0;         // Inside-Out: aggressive curvature
const CAMERA_FOV = 72;           // Inside-Out: wide barrel distortion perspective

const ROW_THETA: Record<number, number> = {
  0: Math.PI / 2 - 0.52, // Top row
  1: Math.PI / 2 - 0.17, // Upper Mid
  2: Math.PI / 2 + 0.17, // Lower Mid
  3: Math.PI / 2 + 0.52, // Bottom row
};

const CARD = {
  width: 3.2,
  height: 2.4,
  segmentsX: 32,
  segmentsY: 2,
  bezelPadding: 0.28,
  bezelDepthOffset: 0.012, // positive Z backing for concave mesh representation
};

const RAIL = {
  color: 0xffffff,
  latitudeOpacity: 0.08,
  longitudeOpacity: 0.06,
  latitudeSegments: 128,
  latitudeTheta: [
    Math.PI / 2 - 0.70,
    Math.PI / 2 - 0.52,
    Math.PI / 2 - 0.17,
    Math.PI / 2 + 0.17,
    Math.PI / 2 + 0.52,
    Math.PI / 2 + 0.70,
  ],
  longitudeSegments: 64,
  railRadius: SPHERE_RADIUS * 0.998,
};

// 3D Geometry Bending
function bendPlaneGeometry(geometry: THREE.BufferGeometry, bendRadius: number): void {
  const position = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);

    const angle = x / bendRadius;
    const newX = bendRadius * Math.sin(angle);
    // Inside-out: concave bend projecting towards origin camera
    const newZ = -(bendRadius * Math.cos(angle) - bendRadius) + z;

    position.setXYZ(i, newX, y, newZ);
  }
  geometry.computeVertexNormals();
}

// Native Canvas Fallback Texture Generator
function createPlaceholderTexture(text: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;
  
  const grad = ctx.createLinearGradient(0, 0, 512, 384);
  grad.addColorStop(0, '#0a0d14');
  grad.addColorStop(1, '#020409');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 384);
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 384); ctx.stroke();
    if (i < 384) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.substring(0, 24).toUpperCase(), 256, 170);
  
  ctx.fillStyle = '#ff3b30';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('🏆 SAHABAT JBM SURABAYA', 256, 215);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Progressive image component for beautiful instantaneous loading and detail enhancement
interface DetailImageProps {
  imageUrl: string;
  alt: string;
}

const DetailImage: React.FC<DetailImageProps> = ({ imageUrl, alt }) => {
  const [hdLoaded, setHdLoaded] = useState(false);
  const [error, setError] = useState(false);

  // When imageUrl changes, reset loaded state
  useEffect(() => {
    setHdLoaded(false);
    setError(false);
    
    const hdUrl = optimizeImageUrl(imageUrl, 2048, 95);
    const img = new Image();
    img.src = hdUrl;
    img.onload = () => {
      setHdLoaded(true);
    };
    img.onerror = () => {
      setError(true);
    };
  }, [imageUrl]);

  const thumbUrl = optimizeImageUrl(imageUrl, 360, 70);
  const hdUrl = optimizeImageUrl(imageUrl, 2048, 95);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black/40 rounded-lg">
      {/* 1. Low-res blurred proxy */}
      <img
        src={thumbUrl}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover blur-md scale-105 transition-opacity duration-500 z-0 ${hdLoaded ? 'opacity-0' : 'opacity-60'}`}
        referrerPolicy="no-referrer"
      />

      {/* 2. Low-res sharp proxy (renders immediately) */}
      <img
        src={thumbUrl}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10 ${hdLoaded ? 'opacity-0' : 'opacity-100'}`}
        referrerPolicy="no-referrer"
      />

      {/* 3. Ultra HD Image (opacity fades in once fully downloaded and parsed by browser) */}
      <img
        src={error ? thumbUrl : hdUrl}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-20 ${hdLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'}`}
        referrerPolicy="no-referrer"
        loading="lazy"
      />

      {/* 4. Elegant circular progress spinner while downloading massive high-fidelity resources */}
      {!hdLoaded && !error && (
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center z-30">
          <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded border border-white/5 backdrop-blur shadow-lg">
            <div className="w-3 h-3 border-[1.5px] border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-[7.5px] font-mono text-white/80 tracking-wider uppercase font-bold">Optimizing HD Card...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const HallOfFameRoom: React.FC<HallOfFameRoomProps> = ({ 
  hallOfFameItems = [], 
  setActiveTab 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // States
  const [is3D, setIs3D] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [zoomedItem, setZoomedItem] = useState<HallOfFameItem | null>(null);
  const [currentZoomedIndex, setCurrentZoomedIndex] = useState<number | null>(null);

  // HUD and DOM Elements
  const hudRef = useRef<HTMLDivElement>(null);
  const [hudContent, setHudContent] = useState<{ name: string; carName: string; location: string } | null>(null);

  // References for imperative Three.js loops
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const galleryGroupRef = useRef<THREE.Group | null>(null);
  const railGroupRef = useRef<THREE.Group | null>(null);

  // State refs (optimized to prevent React re-renders during WebGL drag cycles)
  const stateRef = useRef({
    targetQuaternion: new THREE.Quaternion(),
    preZoomQuaternion: new THREE.Quaternion(),
    velocityX: 0,
    velocityY: 0,
    isDragging: false,
    isZoomed: false,
    previousMouseX: 0,
    previousMouseY: 0,
    startX: 0,
    startY: 0,
    zoomProgress: { value: 0 },
    morphProgress: { value: 0 }, // 0 = 3D Sphere, 1 = 2D Plane Grid
    targetPosition: new THREE.Vector3(0, 0, 0),
    autoSpinTimer: 0,
    autoSpinActive: true,
    accumulatedPitch: 0, // Inside-Out: track vertical tilt constraint
  });

  const cardStatesRef = useRef<Array<{
    group: THREE.Group;
    index: number;
    pos3D: THREE.Vector3;
    pos2D: THREE.Vector3;
    q3d: THREE.Quaternion;
    q2d: THREE.Quaternion;
    zoomFactor: { value: number };
    opacity: { value: number };
    isActive: boolean;
    item: HallOfFameItem;
  }>>([]);

  const imageMeshesRef = useRef<THREE.Mesh[]>([]);
  const hoveredIndexRef = useRef<number | null>(null);
  const activeItemIndexRef = useRef<number | null>(null);

  // Inside-Out Rotation Tuning parameters
  const ROTATION = {
    dragFactorX: 0.0028,      // Vertikal pitch (lebih lambat)
    dragFactorY: 0.0048,      // Horizontal yaw (lebih bebas/responsif)
    velocityDecay: 0.95,      // Silky momentum slide decay
    slerpFactor: 0.08,
    maxPitch: 1.30,           // Batas pitch ±75 derajat (sangat bebas, tapi mencegah gimbal lock)
    autoSpinSpeed: 0.00015,   // Sangat halus dan lambat
  };

  const DRAG_FACTOR = 0.0035;
  const VELOCITY_DECAY = 0.92;
  const SLERP_FACTOR = 0.08;

  // Spherically calculate locations
  const getSphericalPos = (rowIndex: number, colIndex: number): THREE.Vector3 => {
    const theta = ROW_THETA[rowIndex];
    const phiOffset = rowIndex % 2 === 0 ? 0 : (0.5 / COLS) * Math.PI * 2;
    const phi = (colIndex / COLS) * Math.PI * 2 + phiOffset;

    return new THREE.Vector3(
      SPHERE_RADIUS * Math.sin(theta) * Math.sin(phi),
      SPHERE_RADIUS * Math.cos(theta),
      SPHERE_RADIUS * Math.sin(theta) * Math.cos(phi)
    );
  };

  // 2D grid coordinates plan
  const getPlanarPos = (rowIndex: number, colIndex: number): THREE.Vector3 => {
    const colSpacing = 4.3;
    const rowSpacing = 3.3;
    const colStart = -((COLS - 1) * colSpacing) / 2;
    const rowStart = ((ROWS - 1) * rowSpacing) / 2;

    return new THREE.Vector3(
      colStart + (colIndex * colSpacing),
      rowStart - (rowIndex * rowSpacing),
      0
    );
  };

  // Handle Texture preloading and scene mounting
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Build lists of components to fill the 80 virtual slots
    const items = hallOfFameItems.length > 0 ? hallOfFameItems : [
      {
        id: "placeholder-1",
        name: "Haji Rachman",
        carName: "Toyota Innova Reborn V AT",
        date: "14 Mei 2026",
        imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        location: "Surabaya",
        quote: "Mobil istimewa bebas tabrakan parah, bener-bener berkat JBM yang teruji.",
        rating: 5
      }
    ];

    const virtualProjectList = Array.from({ length: TOTAL_NODES }, (_, i) => {
      const dbItem = items[i % items.length];
      return {
        ...dbItem,
        virtualIndex: i
      };
    });

    // 1. Initial Scene, Camera, and Renderer Setup
    const isMobile = window.innerWidth < 768;
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, container.clientWidth / container.clientHeight, 0.1, 1000);
    if (is3DRef.current) {
      camera.position.set(0, 0, 0);
    } else {
      camera.position.set(0, 0, isMobile ? 19 : 24);
    }
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95; // Sedikit lebih dramatis untuk Inside-Out
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const galleryGroup = new THREE.Group();
    scene.add(galleryGroup);
    galleryGroupRef.current = galleryGroup;

    const railGroup = new THREE.Group();
    scene.add(railGroup);
    railGroupRef.current = railGroup;

    // 2. Add Lighting Setup (Premium layout tones - Inside-Out perspective optimization)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // 4 point lights distributed near origin to bounce off inner card facings
    const ptPositions = [
      [0, 4, 0],   // Top
      [0, -4, 0],  // Bottom
      [4, 0, 0],   // Right
      [-4, 0, 0],  // Left
    ];

    ptPositions.forEach(([x, y, z]) => {
      const pt = new THREE.PointLight(0xffffff, 0.45, 50);
      pt.position.set(x, y, z);
      scene.add(pt);
    });

    const warmKey = new THREE.DirectionalLight(0xfff4e0, 0.35); // Warm top key
    warmKey.position.set(0, 20, 0);
    scene.add(warmKey);

    const coolBottom = new THREE.DirectionalLight(0xd0e8ff, 0.2); // Cool bottom separator
    coolBottom.position.set(0, -20, 0);
    scene.add(coolBottom);

    // 3. Setup CAD Wireframe Background Rails
    const createLatRing = (theta: number) => {
      const points: THREE.Vector3[] = [];
      const R = RAIL.railRadius;
      for (let i = 0; i <= RAIL.latitudeSegments; i++) {
        const phi = (i / RAIL.latitudeSegments) * Math.PI * 2;
        points.push(new THREE.Vector3(
          R * Math.sin(theta) * Math.sin(phi),
          R * Math.cos(theta),
          R * Math.sin(theta) * Math.cos(phi)
        ));
      }
      return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: RAIL.color, transparent: true, opacity: RAIL.latitudeOpacity })
      );
    };

    RAIL.latitudeTheta.forEach(theta => {
      railGroup.add(createLatRing(theta));
    });

    const equatorRing = createLatRing(Math.PI / 2);
    (equatorRing.material as THREE.LineBasicMaterial).opacity = 0.12;
    railGroup.add(equatorRing);

    for (let c = 0; c < COLS; c++) {
      const points: THREE.Vector3[] = [];
      const R = RAIL.railRadius;
      const phi = ((c + 0.5) / COLS) * Math.PI * 2;
      for (let j = 0; j <= RAIL.longitudeSegments; j++) {
        const theta = (j / RAIL.longitudeSegments) * Math.PI;
        points.push(new THREE.Vector3(
          R * Math.sin(theta) * Math.sin(phi),
          R * Math.cos(theta),
          R * Math.sin(theta) * Math.cos(phi)
        ));
      }
      railGroup.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: RAIL.color, transparent: true, opacity: RAIL.longitudeOpacity })
      ));
    }

    // 4. Load Textures & Build Cards
    let loadedCount = 0;
    const cardStates: typeof cardStatesRef.current = [];
    const imageMeshes: THREE.Mesh[] = [];

    const onProgress = () => {
      loadedCount++;
      const progress = Math.min(Math.round((loadedCount / TOTAL_NODES) * 100), 100);
      setLoadingProgress(progress);
      if (loadedCount === TOTAL_NODES) {
        setIsLoading(false);
      }
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    // Create cards synchronously first so that the array order is perfectly sequential
    virtualProjectList.forEach((item, index) => {
      const row = Math.floor(index / COLS);
      const col = index % COLS;

      const pos3D = getSphericalPos(row, col);
      const pos2D = getPlanarPos(row, col);

      // Calculations of starting rotations (Inside-Out: cards look outward from origin)
      const dummyObj3D = new THREE.Object3D();
      dummyObj3D.position.copy(pos3D);
      const outwardTarget = pos3D.clone().multiplyScalar(2);
      dummyObj3D.lookAt(outwardTarget);
      const q3d = dummyObj3D.quaternion.clone();
      const q2d = new THREE.Quaternion(); // looking straight forward if morphed to 2D Planar

      const cardGroup = new THREE.Group();
      cardGroup.position.copy(pos3D);
      cardGroup.quaternion.copy(q3d);
      galleryGroup.add(cardGroup);

      // Generate a failsafe, high-fidelity native placeholder texture
      const fallback = createPlaceholderTexture(item.name || item.carName);

      // Plane geometry
      const imgGeo = new THREE.PlaneGeometry(CARD.width, CARD.height, CARD.segmentsX, CARD.segmentsY);
      bendPlaneGeometry(imgGeo, BEND_RADIUS);

      // Self-illuminated MeshBasicMaterial ensures maximum brightness and color depth under any ambient lighting angle
      const imgMesh = new THREE.Mesh(imgGeo, new THREE.MeshBasicMaterial({
        map: fallback,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
      }));
      cardGroup.add(imgMesh);
      imageMeshes[index] = imgMesh;

      // Bezel
      const bezelGeo = new THREE.PlaneGeometry(CARD.width + CARD.bezelPadding, CARD.height + CARD.bezelPadding, CARD.segmentsX, CARD.segmentsY);
      bendPlaneGeometry(bezelGeo, BEND_RADIUS);
      const bezelMesh = new THREE.Mesh(bezelGeo, new THREE.MeshStandardMaterial({
        color: 0x080c12, // obsidian slate back
        roughness: 0.82,
        metalness: 0.05
      }));
      bezelMesh.position.z = CARD.bezelDepthOffset;
      cardGroup.add(bezelMesh);

      // Tech wireframes
      const imgEdges = new THREE.EdgesGeometry(imgGeo);
      const imgWire = new THREE.LineSegments(imgEdges, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08
      }));
      cardGroup.add(imgWire);

      const bezelEdges = new THREE.EdgesGeometry(bezelGeo);
      const bezelWire = new THREE.LineSegments(bezelEdges, new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.16
      }));
      bezelWire.position.z = CARD.bezelDepthOffset;
      cardGroup.add(bezelWire);

      const aoGeo = new THREE.PlaneGeometry(CARD.width, CARD.height, 1, 1);
      const aoMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.0,
        depthWrite: false
      });
      const aoMesh = new THREE.Mesh(aoGeo, aoMat);
      aoMesh.position.z = -0.001;
      cardGroup.add(aoMesh);

      cardGroup.userData = {
        imgMesh,
        bezelMesh,
        imgWire,
        bezelWire,
        aoMesh,
        baseOpacityImg: 0.08,
        baseOpacityBezel: 0.16
      };

      cardStates[index] = {
        group: cardGroup,
        index,
        pos3D,
        pos2D,
        q3d,
        q2d,
        zoomFactor: { value: 1.0 },
        opacity: { value: 1.0 },
        isActive: false,
        item
      };
    });

    cardStatesRef.current = cardStates;
    imageMeshesRef.current = imageMeshes;

    // Load actual textures asynchronously in parallel
    virtualProjectList.forEach((item, index) => {
      let finalUrl = item.imageUrl || '';
      
      // Handle Unsplash URL optimizations to load lightweight 3D world thumbnails for fast entry
      if (finalUrl.includes('images.unsplash.com')) {
        finalUrl = optimizeImageUrl(finalUrl, 360, 70);
      }

      // High-performance Cache Buster: Only apply cache busters to http/https connections.
      // This completely avoids corrupting local base64 (data:) strings while successfully forcing 
      // the browser to bypass any non-CORS cached representations of remote Unsplash images.
      if (finalUrl && (finalUrl.startsWith('http://') || finalUrl.startsWith('https://'))) {
        const cacheBuster = `webgl_cb=${Date.now()}_${index}`;
        if (finalUrl.includes('?')) {
          finalUrl += `&${cacheBuster}`;
        } else {
          finalUrl += `?${cacheBuster}`;
        }
      }

      textureLoader.load(
        finalUrl,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearMipMapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = true;
          if (renderer && renderer.capabilities) {
            const maxAnisotropy = typeof renderer.capabilities.getMaxAnisotropy === 'function' 
              ? renderer.capabilities.getMaxAnisotropy() 
              : 1;
            texture.anisotropy = maxAnisotropy;
          }
          texture.needsUpdate = true;
          
          const targetMesh = imageMeshes[index];
          if (targetMesh && targetMesh.material) {
            const mat = targetMesh.material as THREE.MeshBasicMaterial;
            mat.map = texture;
            mat.needsUpdate = true;
          }
          onProgress();
        },
        undefined,
        (err) => {
          console.warn(`Failed to asynchronously load texture for index ${index}: ${finalUrl}`, err);
          onProgress();
        }
      );
    });

    // 5. Interaction Raycaster (Mouse hover & tap detects)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const getIntersectedIndex = (clientX: number, clientY: number): number | null => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const activeMeshes = imageMeshesRef.current.filter((m): m is THREE.Mesh => m instanceof THREE.Mesh);
      const intersects = raycaster.intersectObjects(activeMeshes, false);

      if (intersects.length > 0) {
        const foundMesh = intersects[0].object as THREE.Mesh;
        for (let i = 0; i < imageMeshesRef.current.length; i++) {
          if (imageMeshesRef.current[i] === foundMesh) return i;
        }
      }
      return null;
    };

    // Hover logic
    let prevHoveredIdx: number | null = null;
    const applyHoverStyle = (idx: number, isHovered: boolean) => {
      const state = cardStatesRef.current[idx];
      if (!state) return;

      gsap.to(state.group.scale, {
        x: isHovered ? 1.08 : 1.0,
        y: isHovered ? 1.08 : 1.0,
        z: isHovered ? 1.08 : 1.0,
        duration: 0.35,
        ease: "power2.out"
      });

      const ud = state.group.userData;
      if (ud) {
        gsap.to(ud.imgWire.material, { opacity: isHovered ? 0.65 : ud.baseOpacityImg, duration: 0.3 });
        gsap.to(ud.bezelWire.material, { opacity: isHovered ? 0.75 : ud.baseOpacityBezel, duration: 0.3 });
        gsap.to(ud.aoMesh.material, { opacity: isHovered ? 0.45 : 0.0, duration: 0.35 });
      }
    };

    const updateHoverState = (clientX: number, clientY: number) => {
      const s = stateRef.current;
      if (s.isDragging || s.isZoomed) return;

      const curHovered = getIntersectedIndex(clientX, clientY);
      if (curHovered !== prevHoveredIdx) {
        if (prevHoveredIdx !== null) applyHoverStyle(prevHoveredIdx, false);
        if (curHovered !== null) {
          applyHoverStyle(curHovered, true);
          container.style.cursor = 'pointer';
          const hoveringItem = cardStatesRef.current[curHovered]?.item;
          if (hoveringItem) {
            setHudContent({
              name: hoveringItem.name,
              carName: hoveringItem.carName,
              location: hoveringItem.location
            });
          }
        } else {
          container.style.cursor = s.isDragging ? 'grabbing' : 'grab';
          if (activeItemIndexRef.current === null) {
            setHudContent(null);
          }
        }
        hoveredIndexRef.current = curHovered;
        prevHoveredIdx = curHovered;
      }
    };

    // Drag / Touch Listeners
    const onDown = (clientX: number, clientY: number) => {
      const s = stateRef.current;
      s.isDragging = true;
      s.startX = clientX;
      s.startY = clientY;
      s.previousMouseX = clientX;
      s.previousMouseY = clientY;
      s.velocityX = 0;
      s.velocityY = 0;
      s.autoSpinActive = false;
      container.style.cursor = 'grabbing';
    };

    const onMove = (clientX: number, clientY: number) => {
      const s = stateRef.current;
      updateHoverState(clientX, clientY);
      if (!s.isDragging) return;

      const deltaX = clientX - s.previousMouseX;
      const deltaY = clientY - s.previousMouseY;

      // Capture instantaneous physical flick velocity with amplification
      s.velocityX = THREE.MathUtils.lerp(s.velocityX, deltaY * ROTATION.dragFactorX * 1.6, 0.4);
      s.velocityY = THREE.MathUtils.lerp(s.velocityY, deltaX * ROTATION.dragFactorY * 1.6, 0.4);

      if (!s.isZoomed) {
        const isCurrently3D = is3DRef.current;
        if (isCurrently3D) {
          const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * ROTATION.dragFactorY);
          s.targetQuaternion.premultiply(qYaw);

          // Constrained vertical tilt to prevent upside down flips
          const newPitch = s.accumulatedPitch + deltaY * ROTATION.dragFactorX;
          const clampedPitch = THREE.MathUtils.clamp(newPitch, -ROTATION.maxPitch, ROTATION.maxPitch);
          const actualDelta = clampedPitch - s.accumulatedPitch;

          if (Math.abs(actualDelta) > 0.0001) {
            const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), actualDelta);
            s.targetQuaternion.premultiply(qPitch);
            s.accumulatedPitch = clampedPitch;
          }
        } else {
          s.targetPosition.x += deltaX * DRAG_FACTOR * 16;
          s.targetPosition.y -= deltaY * DRAG_FACTOR * 16;
          s.targetPosition.x = THREE.MathUtils.clamp(s.targetPosition.x, -28, 28);
          s.targetPosition.y = THREE.MathUtils.clamp(s.targetPosition.y, -16, 16);
        }
      }

      s.previousMouseX = clientX;
      s.previousMouseY = clientY;
    };

    const onUp = (clientX: number, clientY: number, clickThreshold = 8) => {
      const s = stateRef.current;
      s.isDragging = false;
      container.style.cursor = 'grab';
      
      const dx = clientX - s.startX;
      const dy = clientY - s.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Trigger click event ONLY if movement distance was minimal
      if (distance < clickThreshold) {
        const idx = getIntersectedIndex(clientX, clientY);
        if (idx !== null) {
          zoomInToCard(idx);
        } else if (s.isZoomed) {
          zoomOutFromCard();
        }
      }

      s.autoSpinTimer = setTimeout(() => {
        s.autoSpinActive = true;
      }, 4000) as unknown as number;
    };

    // Event bindings standard pointers
    const handlePointerDown = (e: PointerEvent) => {
      if (e.target !== renderer.domElement) return;
      onDown(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      onMove(e.clientX, e.clientY);
    };

    const handlePointerUp = (e: PointerEvent) => {
      onUp(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      stateRef.current.isDragging = false;
      if (prevHoveredIdx !== null) applyHoverStyle(prevHoveredIdx, false);
      prevHoveredIdx = null;
      hoveredIndexRef.current = null;
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointerleave', handlePointerLeave);

    // Zoom mechanisms
    const zoomInToCard = (index: number) => {
      const s = stateRef.current;
      const cardState = cardStatesRef.current[index];
      if (!cardState) return;

      s.isDragging = false;
      s.velocityX = 0;
      s.velocityY = 0;
      s.isZoomed = true;
      s.autoSpinActive = false;

      activeItemIndexRef.current = index;
      setZoomedItem(cardState.item);
      setCurrentZoomedIndex(index);
      setHudContent({
        name: cardState.item.name,
        carName: cardState.item.carName,
        location: cardState.item.location
      });

      s.preZoomQuaternion.copy(galleryGroup.quaternion);

      // Spherically face the camera (Inside-Out)
      const isCurrently3D = is3DRef.current;
      if (isCurrently3D) {
        // Construct standard orthonormal basis for the card to lock orientation perfectly flat and upright
        const localZ = cardState.pos3D.clone().normalize();
        let localX = new THREE.Vector3(0, 1, 0).cross(localZ);
        if (localX.lengthSq() < 0.0001) {
          localX = new THREE.Vector3(1, 0, 0).cross(localZ);
        }
        localX.normalize();
        const localY = localZ.clone().cross(localX).normalize();
        const m = new THREE.Matrix4().makeBasis(localX, localY, localZ);
        const cardLocalRotation = new THREE.Quaternion().setFromRotationMatrix(m);

        // Rotate by 180 deg around vertical Y axis so that the outward-facing card flips around to confront the camera (which looks along -Z)
        const qFlip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
        const focusQuaternion = qFlip.clone().multiply(cardLocalRotation.clone().invert());

        gsap.killTweensOf(galleryGroup.quaternion);
        gsap.killTweensOf(s.zoomProgress);
        s.zoomProgress.value = 0;

        gsap.to(s.zoomProgress, {
          value: 1.0,
          duration: 1.25,
          ease: "power3.inOut",
          onUpdate: () => {
            galleryGroup.quaternion.copy(s.preZoomQuaternion).slerp(focusQuaternion, s.zoomProgress.value);
          },
          onComplete: () => {
            s.targetQuaternion.copy(galleryGroup.quaternion);
            const euler = new THREE.Euler().setFromQuaternion(galleryGroup.quaternion, "YXZ");
            s.accumulatedPitch = THREE.MathUtils.clamp(euler.x, -ROTATION.maxPitch, ROTATION.maxPitch);
          }
        });

        // Pull card closer to center camera (Inside-Out transition factor: 0.45)
        gsap.killTweensOf(cardState.zoomFactor);
        gsap.to(cardState.zoomFactor, {
          value: 0.45,
          duration: 1.25,
          ease: "power3.inOut",
          onUpdate: () => {
            cardState.group.position.copy(cardState.pos3D).multiplyScalar(cardState.zoomFactor.value);
          }
        });

        // Shift gallery so the isolated card is neatly positioned beside the detail panel
        const isMob = window.innerWidth < 768;
        gsap.to(galleryGroup.position, {
          x: isMob ? 0 : 3.2,
          y: isMob ? 0.8 : 0,
          z: 0,
          duration: 1.25,
          ease: "power3.inOut"
        });
      } else {
        // Flat 2D Mode centers grid directly onto item
        gsap.to(galleryGroup.position, {
          x: -cardState.pos2D.x - (window.innerWidth < 768 ? 0 : 3.5),
          y: -cardState.pos2D.y + (window.innerWidth < 768 ? 2.5 : 0),
          z: 0,
          duration: 1.25,
          ease: "power3.inOut"
        });
      }

      // Fade out all non-selected meshes
      cardStatesRef.current.forEach(cs => {
        if (cs.index === index) {
          cs.isActive = true;
          return;
        }
        gsap.to(cs.opacity, {
          value: 0.04,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            cs.group.traverse(child => {
              if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
                const mat = child.material as THREE.Material;
                mat.opacity = cs.opacity.value;
                mat.transparent = true;
              }
            });
          }
        });
      });
    };

    const zoomOutFromCard = () => {
      const s = stateRef.current;
      const isCurrently3D = is3DRef.current;
      const curIdx = activeItemIndexRef.current;
      if (curIdx === null) return;

      s.isZoomed = false;
      activeItemIndexRef.current = null;
      setZoomedItem(null);
      setCurrentZoomedIndex(null);
      setHudContent(null);

      // Animate gallery back to position
      gsap.to(galleryGroup.position, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power3.inOut" });

      if (isCurrently3D) {
        const startQ = galleryGroup.quaternion.clone();
        gsap.to(s.zoomProgress, {
          value: 0.0,
          duration: 1.05,
          ease: "power3.inOut",
          onUpdate: () => {
            galleryGroup.quaternion.copy(startQ).slerp(s.preZoomQuaternion, 1.0 - s.zoomProgress.value);
          },
          onComplete: () => {
            s.targetQuaternion.copy(galleryGroup.quaternion);
            const euler = new THREE.Euler().setFromQuaternion(galleryGroup.quaternion, "YXZ");
            s.accumulatedPitch = THREE.MathUtils.clamp(euler.x, -ROTATION.maxPitch, ROTATION.maxPitch);
          }
        });

        const activeState = cardStatesRef.current[curIdx];
        if (activeState) {
          gsap.to(activeState.zoomFactor, {
            value: 1.0,
            duration: 1.05,
            ease: "power3.inOut",
            onUpdate: () => {
              activeState.group.position.copy(activeState.pos3D).multiplyScalar(activeState.zoomFactor.value);
            }
          });
        }
      }

      // Restore opacities
      cardStatesRef.current.forEach(cs => {
        cs.isActive = false;
        gsap.to(cs.opacity, {
          value: 1.0,
          duration: 0.8,
          ease: "power2.inOut",
          onUpdate: () => {
            cs.group.traverse(child => {
              if (child instanceof THREE.Mesh) {
                (child.material as THREE.Material).opacity = cs.opacity.value;
              } else if (child instanceof THREE.LineSegments) {
                const ud = cs.group.userData;
                (child.material as THREE.Material).opacity = cs.opacity.value * (child === ud.imgWire ? ud.baseOpacityImg : ud.baseOpacityBezel);
              }
            });
          }
        });
      });

      s.autoSpinActive = true;
    };

    // Store key helper scopes on window for global triggers
    (window as any)._jbmZoomOut = zoomOutFromCard;

    // keyboard support
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        zoomOutFromCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 6. Game Animation Loop (Silky 120 FPS requestAnimationFrame)
    let rafId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const s = stateRef.current;
      const isCurrently3D = is3DRef.current;

      if (isCurrently3D) {
        if (!s.isZoomed) {
          if (!s.isDragging) {
            if (Math.abs(s.velocityX) > 0.00005 || Math.abs(s.velocityY) > 0.00005) {
              const newPitch = s.accumulatedPitch + s.velocityX;
              const clampedPitch = THREE.MathUtils.clamp(newPitch, -ROTATION.maxPitch, ROTATION.maxPitch);
              const pitchDelta = clampedPitch - s.accumulatedPitch;

              const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitchDelta);
              const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), s.velocityY);
              s.targetQuaternion.premultiply(qPitch).premultiply(qYaw);
              s.accumulatedPitch = clampedPitch;

              s.velocityX *= ROTATION.velocityDecay;
              s.velocityY *= ROTATION.velocityDecay;
            }

            // Ambient idle spin
            if (s.autoSpinActive) {
              const qAuto = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), ROTATION.autoSpinSpeed);
              s.targetQuaternion.premultiply(qAuto);
            }
          }
          
          // Smoother render follow: Fast follow slerp during dragging, standard easing on release
          const activeSlerp = s.isDragging ? 0.22 : ROTATION.slerpFactor;
          galleryGroup.quaternion.slerp(s.targetQuaternion, activeSlerp);
        }
      } else {
        // 2D Mode - always slerp quaternion to identity
        galleryGroup.quaternion.slerp(new THREE.Quaternion(), SLERP_FACTOR);
        if (!s.isZoomed) {
          const activeLerp = s.isDragging ? 0.25 : SLERP_FACTOR;
          galleryGroup.position.lerp(s.targetPosition, activeLerp);
        }
      }

      // Projections of active/hovered indexes to screen space coordinates
      const activeIdx = activeItemIndexRef.current !== null ? activeItemIndexRef.current : hoveredIndexRef.current;
      if (activeIdx !== null && !s.isZoomed && cardStatesRef.current[activeIdx] && hudRef.current) {
        const gp = cardStatesRef.current[activeIdx].group;
        const tempV = new THREE.Vector3();
        gp.getWorldPosition(tempV);

        // Inside-Out Dot product visibility check! Only display if card is somewhat in front of our camera view
        const cameraForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const cardDir = tempV.clone().normalize();
        const dotProduct = cameraForward.dot(cardDir);

        tempV.project(camera);

        const isBehind = tempV.z > 1.0 || (isCurrently3D && dotProduct < 0.1);
        if (isBehind) {
          hudRef.current.style.opacity = '0';
        } else {
          const rect = container.getBoundingClientRect();
          const x = (tempV.x * 0.5 + 0.5) * rect.width;
          const y = (1.0 - (tempV.y * 0.5 + 0.5)) * rect.height;

          hudRef.current.style.opacity = '1';
          hudRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -105%)`;
        }
      } else if (hudRef.current) {
        hudRef.current.style.opacity = '0';
      }

      renderer.render(scene, camera);
    };

    // Tab visibility RAF saver
    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else clock.getDelta(); // reset clock interval
    };
    document.addEventListener('visibilitychange', handleVisibility);

    animate();

    // 7. Responsive Resizer
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const cam = cameraRef.current as THREE.PerspectiveCamera;
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      
      const isMob = w < 768;
      // Inside-Out: camera is at (0,0,0) in 3D Mode, and moves to Z=19/24 in 2D Mode
      if (is3DRef.current) {
        cam.position.set(0, 0, 0);
      } else {
        cam.position.set(0, 0, isMob ? 19 : 24);
      }
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // 8. Cleanup Scope
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(stateRef.current.autoSpinTimer);

      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      
      // Memory cleanup
      scene.traverse(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
          else child.material.dispose();
        } else if (child instanceof THREE.LineSegments) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });

      railGroup.traverse(child => {
        if (child instanceof THREE.Line) {
          child.geometry.dispose();
          (child.material as THREE.Material).dispose();
        }
      });

      renderer.dispose();
      try {
        container.removeChild(renderer.domElement);
      } catch (e) {
        // Safe skip if child already unmounted
      }
    };
  }, [hallOfFameItems]);

  // Keep references updated for callback contexts
  const is3DRef = useRef(is3D);
  useEffect(() => {
    is3DRef.current = is3D;
    
    // Animate morph positions of nodes
    const easeVal = is3D ? 0 : 1;
    gsap.killTweensOf(stateRef.current.morphProgress);
    gsap.to(stateRef.current.morphProgress, {
      value: easeVal,
      duration: 1.2,
      ease: "power3.inOut",
      onUpdate: () => {
        const progress = stateRef.current.morphProgress.value;
        cardStatesRef.current.forEach(cs => {
          cs.group.position.lerpVectors(cs.pos3D, cs.pos2D, progress);
          cs.group.quaternion.slerpQuaternions(cs.q3d, cs.q2d, progress);

          // Dynamic bezel and ambient occlusion Z-shift to guarantee image/backer visibility 
          // 3D mode (progress=0, camera inside): bezel goes behind the card (positive local Z), shadow in front (negative local Z)
          // 2D mode (progress=1, camera outside): bezel goes behind the card (negative local Z), shadow in front (positive local Z)
          const bezelZ = CARD.bezelDepthOffset * (1.0 - 2.0 * progress);
          const aoZ = 0.001 * (2.0 * progress - 1.0);
          
          const ud = cs.group.userData;
          if (ud) {
            if (ud.bezelMesh) ud.bezelMesh.position.z = bezelZ;
            if (ud.bezelWire) ud.bezelWire.position.z = bezelZ;
            if (ud.aoMesh) ud.aoMesh.position.z = aoZ;
          }
        });
        
        // morph the background rail grid
        if (railGroupRef.current) {
          railGroupRef.current.scale.setScalar(1.0 - progress);
          railGroupRef.current.traverse(child => {
            if (child instanceof THREE.Line) {
              (child.material as THREE.Material).opacity = RAIL.latitudeOpacity * (1.0 - progress);
            }
          });
        }
      }
    });

    // Smoothly animate the camera position when swapping layout modes
    if (cameraRef.current) {
      const isMob = window.innerWidth < 768;
      const camTargetPos = is3D ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(0, 0, isMob ? 19 : 24);
      gsap.to(cameraRef.current.position, {
        x: camTargetPos.x,
        y: camTargetPos.y,
        z: camTargetPos.z,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => {
          if (cameraRef.current && !is3D) {
            cameraRef.current.lookAt(0, 0, 0); // focus on center in 2D mode
          }
        },
        onComplete: () => {
          if (cameraRef.current) {
            if (is3D) {
              cameraRef.current.rotation.set(0, 0, 0); // look straight forward inside sphere
            } else {
              cameraRef.current.lookAt(0, 0, 0);
            }
          }
        }
      });
    }

    // If active zoomed item exists, trigger camera adjust instantly
    const zoomedIndex = activeItemIndexRef.current;
    if (zoomedIndex !== null) {
      const cardState = cardStatesRef.current[zoomedIndex];
      const s = stateRef.current;
      if (cardState) {
        if (!is3D) {
          // Flattening mode positioning
          gsap.to(galleryGroupRef.current!.position, {
            x: -cardState.pos2D.x - (window.innerWidth < 768 ? 0 : 3.5),
            y: -cardState.pos2D.y + (window.innerWidth < 768 ? 2.5 : 0),
            z: 0,
            duration: 1.0,
            ease: "power2.inOut"
          });
        } else {
          // Sphere mode positioning (Inside-Out)
          const isMob = window.innerWidth < 768;
          gsap.to(galleryGroupRef.current!.position, {
            x: isMob ? 0 : 3.2,
            y: isMob ? 0.8 : 0,
            z: 0,
            duration: 1.0,
            ease: "power2.inOut"
          });
          
          cardState.group.position.copy(cardState.pos3D).multiplyScalar(cardState.zoomFactor.value);

          const cardLocalDir = cardState.pos3D.clone().normalize();
          const cameraForward = new THREE.Vector3(0, 0, -1);
          const qAlign = new THREE.Quaternion().setFromUnitVectors(cardLocalDir, cameraForward);
          const focusQuaternion = qAlign;

          gsap.to(s.zoomProgress, {
            value: 1.0,
            duration: 1.0,
            ease: "power2.inOut",
            onUpdate: () => {
              galleryGroupRef.current!.quaternion.copy(s.preZoomQuaternion).slerp(focusQuaternion, s.zoomProgress.value);
            }
          });
        }
      }
    } else {
      // Return position if no active isolation
      gsap.to(galleryGroupRef.current!.position, { x: 0, y: 0, z: 0, duration: 1.0, ease: "power2.inOut" });
    }

  }, [is3D]);

  // Public close hook wrapper
  const triggerZoomOut = () => {
    if ((window as any)._jbmZoomOut) {
      (window as any)._jbmZoomOut();
    }
  };

  const handleResetView = () => {
    // 1. Zoom out from card if currently isolated
    triggerZoomOut();

    // 2. Smoothly reset sphere/grid rotation, momentum, and panning
    const s = stateRef.current;
    s.velocityX = 0;
    s.velocityY = 0;
    s.accumulatedPitch = 0;
    s.autoSpinActive = true;
    
    // GSAP tween the gallery variables back to default
    if (galleryGroupRef.current) {
      gsap.killTweensOf(galleryGroupRef.current.position);
      gsap.killTweensOf(galleryGroupRef.current.quaternion);

      gsap.to(galleryGroupRef.current.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.0,
        ease: "power3.inOut"
      });

      const startQ = galleryGroupRef.current.quaternion.clone();
      const endQ = new THREE.Quaternion(); // Identity quaternion
      const animObj = { progress: 0 };
      
      gsap.to(animObj, {
        progress: 1.0,
        duration: 1.0,
        ease: "power3.inOut",
        onUpdate: () => {
          if (galleryGroupRef.current) {
            galleryGroupRef.current.quaternion.copy(startQ).slerp(endQ, animObj.progress);
          }
        },
        onComplete: () => {
          if (galleryGroupRef.current) {
            galleryGroupRef.current.quaternion.copy(endQ);
            s.targetQuaternion.copy(endQ);
          }
        }
      });
    }

    // Reset 2D panning position target
    s.targetPosition.set(0, 0, 0);
  };

  return (
    <div className="w-full h-[84vh] md:h-[88vh] min-h-[580px] bg-[#030508] text-white select-none relative overflow-hidden rounded-2xl border border-white/5 flex flex-col font-sans animate-fadeIn">
      
      {/* Background Blueprint Grid Line */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" 
        style={{ 
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Preloader progress loader */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#04060b] z-[60] flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center space-y-1">
            <h2 className="font-sans font-black text-xs uppercase tracking-[0.2em] text-gray-400">LOADING 3D WIRESTAGE</h2>
            <p className="font-mono text-[9px] text-gray-600">JBM SURABAYA ARCHITECTURAL REALM</p>
          </div>
          <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden relative">
            <div 
              className="absolute left-0 top-0 bottom-0 bg-red-500 transition-all duration-300" 
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="font-mono text-[9px] text-red-500 tracking-widest">{loadingProgress}%</span>
        </div>
      )}

      {/* THREEJS CANVAS MOUNT CONTAINER */}
      <div 
        ref={containerRef}
        className="w-full flex-grow relative overflow-hidden cursor-grab active:cursor-grabbing"
      />

      {/* HOVER / PROJECTED 3D COORDS HUD LABELS */}
      <div
        ref={hudRef}
        className="absolute pointer-events-none transition-all duration-100 ease-out z-30 opacity-0"
        style={{ left: 0, top: 0 }}
      >
        <div className="bg-black/85 backdrop-blur-sm border border-white/10 px-3 py-2 rounded shadow-xl text-left min-w-[140px]">
          <span className="text-[7px] font-mono text-red-500 uppercase tracking-widest block font-bold">CLIENT RECORD</span>
          <p className="font-sans font-black text-[11px] text-white uppercase truncate mt-0.5">
            {hudContent?.name || "HAPPY CUSTOMER"}
          </p>
          <div className="w-12 h-px bg-white/10 my-1" />
          <p className="font-mono text-[8px] text-gray-400 truncate uppercase mt-0.5">
            {hudContent?.carName || "RELIABLE UNIT"}
          </p>
          <p className="font-mono text-[7px] text-gray-600 uppercase mt-0.5">
            DELIVERED · {hudContent?.location || "SURABAYA"}
          </p>
        </div>
        <div className="w-px h-3 bg-red-500/40 mx-auto" />
        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mx-auto" />
      </div>

      {/* FLOOR INFORMATION BLOCK (BOTTOM LEFT) */}
      <div className="absolute bottom-6 left-6 z-40 text-left pointer-events-none hidden md:block select-none">
        <span className="text-[20px] font-sans font-black text-white/5 uppercase tracking-[0.2em] block leading-none">HALL OF FAME</span>
        <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest mt-1 block">JBM DRAFTING MATRIX SYSTEM v1.02</span>
      </div>

      {/* FLOAT PANNING CONTROL BUTTONS PANEL */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 bg-black/95 border border-white/10 px-3 py-1.5 rounded-lg flex items-center justify-center gap-3 shadow-2xl backdrop-blur-md animate-slideUp">
        
        {/* Toggle 3D vs 2D plan */}
        <div className="flex bg-neutral-900 border border-white/5 p-0.5 rounded select-none">
          <button
            onClick={() => setIs3D(false)}
            className={`px-3 py-1 rounded text-[8px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${!is3D ? 'bg-white text-black' : 'text-gray-500 hover:text-white bg-transparent'}`}
          >
            2D Plan
          </button>
          <button
            onClick={() => setIs3D(true)}
            className={`px-3 py-1 rounded text-[8px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${is3D ? 'bg-white text-black' : 'text-gray-500 hover:text-white bg-transparent'}`}
          >
            3D Room
          </button>
        </div>

        <div className="w-px h-3.5 bg-white/10" />

        <button 
          onClick={handleResetView} 
          className="hover:bg-white/5 p-1 rounded text-red-500 hover:text-red-400 cursor-pointer transition-colors"
          title="Reset View & Rotation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">
          {is3D ? "[3D_ROOM_ACTIVE]" : "[2D_PLAN_GRID]"}
        </span>
      </div>

      {/* OH-ARCHITECTURE DRAG TUTORIAL HINT */}
      <div className="absolute bottom-6 right-6 z-40 pointer-events-none hidden sm:block">
        <div className="bg-black/95 border border-white/10 p-2 rounded-lg flex flex-col items-center gap-1.5 max-w-[150px] shadow-2xl">
          <div className="w-28 h-12 bg-[#050608] rounded border border-white/5 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f141d_1px,transparent_1px),linear-gradient(to_bottom,#0f141d_1px,transparent_1px)] bg-[size:8px_8px]" />
            <div className="w-1.5 h-1.5 bg-red-500/20 rounded-full animate-ping absolute" />
            <Hand className="w-3.5 h-3.5 text-red-500" />
          </div>
          <span className="text-[7px] font-mono text-gray-500 tracking-wider text-center leading-tight uppercase">
            CLICK + DRAG TO VIEW
          </span>
        </div>
      </div>

      {/* DETAILED GLASSMORPHISM SIDE PANEL OVERLAY */}
      {zoomedItem && (
        <div className="absolute md:top-4 md:right-4 md:bottom-4 md:w-[360px] top-auto bottom-4 left-4 right-4 z-50 bg-black/90 md:border md:border-white/10 border-t border-white/15 backdrop-blur-lg md:rounded-xl p-5 flex flex-col justify-between shadow-2xl animate-scaleUp md:h-auto max-h-[75vh] md:max-h-none overflow-y-auto text-left">
          
          <button 
            onClick={triggerZoomOut}
            className="absolute top-4 right-4 bg-neutral-900 hover:bg-red-950 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white p-1 rounded transition-all cursor-pointer z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="space-y-4">
            {/* Header Badge */}
            <div className="flex items-center gap-1.5 mt-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-[8px] font-mono text-yellow-500 uppercase tracking-[0.2em] font-bold">JBM CERTIFIED PATRON</span>
            </div>

            {/* Title Client */}
            <div>
              <span className="text-[7px] font-mono text-gray-500 uppercase tracking-widest">OWNER DISCLOSURE</span>
              <h3 className="font-sans font-black text-base text-white tracking-wide uppercase leading-tight mt-0.5">
                {zoomedItem.name}
              </h3>
              <p className="font-mono text-[8px] text-gray-500 mt-1">{zoomedItem.date} · {zoomedItem.location}</p>
            </div>

            {/* Image display representation */}
            <div className="w-full aspect-[4/3] rounded-lg border border-white/10 overflow-hidden bg-black/50 relative shadow-inner">
              <DetailImage imageUrl={zoomedItem.imageUrl} alt={zoomedItem.name} />
              <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-black/60 px-1.5 py-0.5 rounded text-yellow-500 z-30">
                {[...Array(zoomedItem.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-2.5 h-2.5 fill-yellow-500 stroke-none" />
                ))}
              </div>
            </div>

            {/* Testimonial written review */}
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg relative">
              <span className="text-xl font-serif text-red-500 opacity-20 absolute top-0 left-2">“</span>
              <p className="text-[11px] text-gray-300 italic leading-relaxed pl-3 pr-2 font-sans">
                {zoomedItem.quote}
              </p>
            </div>

            {/* Tech Specs */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[8px] border-t border-white/5 pt-3">
              <div>
                <span className="text-gray-500 uppercase block">Chassis / Unit</span>
                <span className="text-white font-black uppercase mt-0.5 block truncate">{zoomedItem.carName}</span>
              </div>
              <div>
                <span className="text-gray-500 uppercase block">Verify Class</span>
                <span className="text-emerald-500 font-black block mt-0.5">PASSED (150+ PTS)</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-5 border-t border-white/5 mt-4">
            <button 
              onClick={triggerZoomOut}
              className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-gray-300 hover:text-white px-3 py-2 rounded text-[9px] font-mono uppercase font-black tracking-wider transition-all border border-white/5 cursor-pointer text-center"
            >
              ZOOM OUT
            </button>
            <a
              href={`https://wa.me/6281330253797?text=Halo%20Jaya%20Berkat%20Mobil,%20saya%20tertarik%20dengan%20serah%20terima%20unit%20*${encodeURIComponent(zoomedItem.name)}*%20yang%20puas%20membeli%20*${encodeURIComponent(zoomedItem.carName)}*!%20Bisa%20berkonsultasi?`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-gray-200 text-black px-3 py-2 rounded text-[9px] font-mono font-black uppercase tracking-wider transition-all shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5 text-black" />
              <span>CONSULT</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
