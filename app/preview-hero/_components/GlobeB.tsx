'use client';

/**
 * Globe variant B — raw @react-three/fiber
 *
 * Hand-built from three primitives. More control, unique look,
 * custom atmosphere shader + particle starfield.
 *
 * This file must be dynamically imported from the page with
 * { ssr: false } so WebGL globals never run on the server.
 */

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
// Import drei helpers directly from their deep paths to avoid pulling in
// the full drei index, which drags `Text` + `troika-three-text` +
// `webgl-sdf-generator` + `bidi-js` (the latter two have broken
// esm/cjs interop and fail to compile in Next.js).
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { Stars } from '@react-three/drei/core/Stars';
import * as THREE from 'three';
import { JURISDICTIONS, GLOBE_ARCS, type GlobeArc as GlobeArcData } from '../_data/jurisdictions';

type Props = {
  width: number;
  height: number;
};

export default function GlobeB({ width, height }: Props) {
  return (
    <div className="relative h-full w-full">
      {/* Radial aura */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(167,139,250,0.10) 0%, rgba(34,211,238,0.06) 30%, transparent 60%)',
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 340], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width, height, background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} />
          <directionalLight position={[250, 200, 200]} intensity={0.7} color="#FFFFFF" />
          <pointLight position={[-200, -150, 100]} intensity={0.6} color="#22D3EE" />
          <pointLight position={[200, -150, -100]} intensity={0.5} color="#A78BFA" />

          <Stars radius={600} depth={80} count={3500} factor={4} saturation={0} fade speed={0.4} />

          <Scene />

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.4}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Scene graph
 * ------------------------------------------------------------------ */

function Scene() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.03;
  });

  return (
    <group ref={groupRef}>
      <GlobeMesh />
      <Atmosphere />
      {JURISDICTIONS.map((j) => (
        <JurisdictionNode key={j.id} lat={j.lat} lng={j.lng} color={j.color} brokerCount={j.brokerCount} />
      ))}
      {GLOBE_ARCS.map((a, i) => (
        <TradeArc key={i} arc={a} />
      ))}
    </group>
  );
}

function GlobeMesh() {
  const texture = useLoader(THREE.TextureLoader, '/earth-blue-marble.jpg');
  return (
    <mesh>
      <sphereGeometry args={[100, 64, 64]} />
      <meshPhongMaterial
        map={texture}
        shininess={15}
        specular={new THREE.Color('#1a3a5c')}
      />
    </mesh>
  );
}

function Atmosphere() {
  // Inverted-faces shader sphere for the fresnel-style glow.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            vec3 glow = mix(vec3(0.27, 0.83, 0.93), vec3(0.29, 0.87, 0.50), intensity);
            gl_FragColor = vec4(glow, 1.0) * intensity;
          }
        `,
      }),
    []
  );

  return (
    <mesh scale={[1.16, 1.16, 1.16]}>
      <sphereGeometry args={[100, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

// Convert lat/lng into XYZ on sphere surface.
function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function JurisdictionNode({
  lat,
  lng,
  color,
  brokerCount,
}: {
  lat: number;
  lng: number;
  color: string;
  brokerCount: number;
}) {
  const position = useMemo(() => latLngToVec3(lat, lng, 101), [lat, lng]);
  const size = 0.6 + brokerCount / 80;
  const ringRef = useRef<THREE.Mesh>(null!);

  // Pulsing outer ring, phased per node.
  const phaseOffset = useMemo(() => (lat + lng) * 0.03, [lat, lng]);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = ((clock.elapsedTime + phaseOffset) % 2) / 2;
      ringRef.current.scale.setScalar(1 + t * 3);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, 0.9 - t);
    }
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      <mesh scale={[0.5, 0.5, 0.5]}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.1, size * 1.5, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function TradeArc({ arc }: { arc: GlobeArcData }) {
  const { line } = useMemo(() => {
    const start = latLngToVec3(arc.startLat, arc.startLng, 100);
    const end = latLngToVec3(arc.endLat, arc.endLng, 100);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.normalize().multiplyScalar(100 + dist * 0.45);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(arc.color[0]),
      transparent: true,
      opacity: 0.55,
    });
    return { line: new THREE.Line(geometry, material) };
  }, [arc]);

  return <primitive object={line} />;
}
