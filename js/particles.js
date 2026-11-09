/**
 * ============================================================================
 * CYBERPUNK 3D PARTICLE ENGINE (THREE.JS)
 * Features:
 * - Dynamic Procedural Glow Particle Texture
 * - 2,800 Point Volumetric Cyber Grid Field
 * - Crimson & Neon Red Spectral Distribution
 * - Smooth Mouse & Touch Parallax Tracking with Momentum Lerp
 * - Floating Holographic Wireframe Cyber Matrix
 * ============================================================================
 */

(function () {
  'use strict';

  let scene, camera, renderer;
  let particleSystem, particleGeometry, particleMaterial;
  let cyberMeshGroup, outerWireframeIcosahedron, innerRingMesh;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let clock;
  let isMobile = false;

  // Check touch / mobile device
  function checkDevice() {
    isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
  }

  // Generate procedural soft-glow radial texture for particles
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 60, 90, 0.9)');
    gradient.addColorStop(0.5, 'rgba(220, 20, 60, 0.4)');
    gradient.addColorStop(0.8, 'rgba(150, 0, 30, 0.15)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function init() {
    checkDevice();
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    clock = new THREE.Clock();

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050508, 0.0018);

    // Camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Cloud Setup
    const particleCount = isMobile ? 1200 : 2600;
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    // Color Palette: Deep Crimson, Neon Red, Bright Coral, and Cyber Accent
    const palette = [
      new THREE.Color(0xff2a4b), // Neon Red
      new THREE.Color(0xff4d6d), // Bright Crimson
      new THREE.Color(0xe60000), // Pure Red
      new THREE.Color(0x99001f), // Deep Ruby
      new THREE.Color(0xffffff)  // Sparkle White
    ];

    for (let i = 0; i < particleCount; i++) {
      // Cylindrical / volumetric distribution across space
      const radius = 300 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi) + (Math.random() - 0.5) * 400;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      // Color selection with dominant crimson
      const col = palette[Math.floor(Math.random() * (palette.length - 1))];
      // Occasional pure bright spark
      if (Math.random() > 0.92) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 0.95;
      } else {
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      scales[i] = Math.random() * 20 + 8;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 18 : 24,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Holographic Cyber Matrix (Rotating Wireframe Geometries)
    cyberMeshGroup = new THREE.Group();

    // Outer Icosahedron Wireframe
    const icoGeo = new THREE.IcosahedronGeometry(420, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xff2a4b,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    outerWireframeIcosahedron = new THREE.Mesh(icoGeo, icoMat);
    cyberMeshGroup.add(outerWireframeIcosahedron);

    // Concentric Torus Cyber Rings
    const ringGeo = new THREE.TorusGeometry(320, 1.5, 8, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    innerRingMesh = new THREE.Mesh(ringGeo, ringMat);
    innerRingMesh.rotation.x = Math.PI / 3;
    cyberMeshGroup.add(innerRingMesh);

    const ring2Geo = new THREE.TorusGeometry(220, 1.2, 8, 36);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xff2a4b,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const innerRing2 = new THREE.Mesh(ring2Geo, ring2Mat);
    innerRing2.rotation.y = Math.PI / 4;
    cyberMeshGroup.add(innerRing2);

    cyberMeshGroup.position.set(200, 50, -200);
    scene.add(cyberMeshGroup);

    // Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
    document.addEventListener('touchmove', onDocumentTouchMove, { passive: true });

    // Begin Loop
    animate();
  }

  function onWindowResize() {
    checkDevice();
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.8;
    mouseY = (event.clientY - windowHalfY) * 0.8;
  }

  function onDocumentTouchMove(event) {
    if (event.touches.length > 0) {
      mouseX = (event.touches[0].clientX - windowHalfX) * 0.6;
      mouseY = (event.touches[0].clientY - windowHalfY) * 0.6;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth Parallax Lerp
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 0.5;
    camera.position.y = -targetY * 0.5 + 50;
    camera.lookAt(scene.position);

    // Particle Cloud Dynamics
    if (particleSystem) {
      particleSystem.rotation.y = elapsedTime * 0.035;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.08;

      // Slight pulsing wave on particle positions
      const positions = particleGeometry.attributes.position.array;
      const count = positions.length / 3;
      for (let i = 0; i < count; i += 6) {
        positions[i * 3 + 1] += Math.sin(elapsedTime * 1.5 + positions[i * 3]) * 0.2;
      }
      particleGeometry.attributes.position.needsUpdate = true;
    }

    // Holographic Mesh Dynamics
    if (cyberMeshGroup) {
      outerWireframeIcosahedron.rotation.x = elapsedTime * 0.08;
      outerWireframeIcosahedron.rotation.y = elapsedTime * 0.12;

      innerRingMesh.rotation.z = -elapsedTime * 0.15;
      innerRingMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.4) * 0.1;

      // Subtly track mouse
      cyberMeshGroup.position.x = 200 + targetX * 0.15;
      cyberMeshGroup.position.y = 50 - targetY * 0.15;
    }

    renderer.render(scene, camera);
  }

  // Self-start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
