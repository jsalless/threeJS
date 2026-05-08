'use client';

import { useEffect, useRef } from 'react';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let renderer: import('three').WebGLRenderer | null = null;

    async function init() {
      const THREE = await import('three');
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Scene
      const scene = new THREE.Scene();

      // Camera
      const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
      camera.position.z = 5;

      // Renderer
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      // ── Particles ──────────────────────────────────────────────────
      const particleCount = 1800;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const palette = [
        new THREE.Color('#6366f1'),
        new THREE.Color('#818cf8'),
        new THREE.Color('#22d3ee'),
        new THREE.Color('#a855f7'),
        new THREE.Color('#ffffff'),
      ];

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2.5 + 0.5;
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      pGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const pMat = new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      });

      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ── Floating Wireframe Geometries ──────────────────────────────
      const geoShapes = [
        new THREE.IcosahedronGeometry(0.55, 1),
        new THREE.OctahedronGeometry(0.4, 0),
        new THREE.TorusGeometry(0.35, 0.12, 8, 24),
        new THREE.TetrahedronGeometry(0.45, 0),
      ];

      const meshGroup = new THREE.Group();
      const meshes: THREE.Mesh[] = [];

      const positions3D = [
        [-2.8, 1.2, -1], [2.5, -0.8, -0.5],
        [-1.8, -1.6, 0.5], [3.2, 1.5, -1.5],
        [-3.5, 0.2, 0], [1.0, 2.0, -0.8],
      ];

      positions3D.forEach(([x, y, z], i) => {
        const geoIndex = i % geoShapes.length;
        const mat = new THREE.MeshBasicMaterial({
          color: palette[i % palette.length],
          wireframe: true,
          transparent: true,
          opacity: 0.35,
        });
        const mesh = new THREE.Mesh(geoShapes[geoIndex], mat);
        mesh.position.set(x, y, z);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        meshGroup.add(mesh);
        meshes.push(mesh);
      });

      scene.add(meshGroup);

      // ── Mouse parallax ─────────────────────────────────────────────
      let mouseX = 0, mouseY = 0;
      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove);

      // ── Resize ─────────────────────────────────────────────────────
      const onResize = () => {
        if (!canvas || !renderer) return;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // ── Animation loop ─────────────────────────────────────────────
      const clock = new THREE.Clock();

      function animate() {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        // Rotate particles
        particles.rotation.y = t * 0.015;
        particles.rotation.x = t * 0.008;

        // Parallax
        meshGroup.rotation.y += (mouseX * 0.3 - meshGroup.rotation.y) * 0.03;
        meshGroup.rotation.x += (mouseY * 0.2 - meshGroup.rotation.x) * 0.03;

        // Float each mesh
        meshes.forEach((m, i) => {
          m.rotation.x += 0.003 + i * 0.001;
          m.rotation.y += 0.005 + i * 0.0008;
          m.position.y += Math.sin(t * 0.5 + i * 1.2) * 0.002;
        });

        renderer!.render(scene, camera);
      }

      animate();

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        cancelAnimationFrame(animId);
        renderer?.dispose();
      };
    }

    const cleanup = init();
    return () => {
      cleanup.then(fn => fn?.());
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
