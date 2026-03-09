/**
 * Political Constellation — 3D Visualization Engine
 *
 * Renders the belief constellation using Three.js (r128).
 * Each issue becomes a geometric shape whose properties encode meaning:
 *   Size      → priority
 *   Opacity   → commitment
 *   Color     → position (blue ↔ red)
 *   Geometry  → authority level (tetrahedron / octahedron / icosahedron)
 *
 * Public API (via window.Constellation):
 *   init(container, canvas, issues)   — bootstrap the scene
 *   updateShape(issueName)            — rebuild one shape after slider change
 */
(function (global) {
  'use strict';

  // ── State ──────────────────────────────────────────────
  var scene, camera, renderer;
  var issueShapes = {};
  var issuesRef;                    // reference stored at init time

  var rotationX = 0.3;
  var rotationY = 0.5;
  var isDragging = false;
  var prev = { x: 0, y: 0 };

  // ── Tunables ───────────────────────────────────────────
  var BG_COLOR        = 0x0a1e41;
  var WIREFRAME_COLOR = 0xb08d1e;
  var DEFAULT_ZOOM    = 15;
  var MIN_ZOOM        = 8;
  var MAX_ZOOM        = 25;

  // ── Public: init ───────────────────────────────────────
  function init(container, canvas, issues) {
    issuesRef = issues;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = DEFAULT_ZOOM;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(BG_COLOR, 1);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    var light1 = new THREE.DirectionalLight(0xffffff, 0.5);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    var light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(-5, -5, -5);
    scene.add(light2);

    // Initial shapes
    createAllShapes();

    // Input
    bindInputs(canvas);
    window.addEventListener('resize', function () { onResize(container); });

    // Go
    animate();
  }

  // ── Public: updateShape ────────────────────────────────
  function updateShape(issueName) {
    var old = issueShapes[issueName];
    var pos = old.position.clone();
    scene.remove(old);

    var shape = buildShape(issuesRef[issueName], pos.x, pos.y, pos.z);
    issueShapes[issueName] = shape;
    scene.add(shape);
  }

  // ── Shape factory ──────────────────────────────────────
  function createAllShapes() {
    var names = Object.keys(issuesRef);
    var step  = (Math.PI * 2) / names.length;

    names.forEach(function (name, i) {
      var angle  = step * i;
      var radius = 6;
      var x = Math.cos(angle) * radius;
      var z = Math.sin(angle) * radius;

      var shape = buildShape(issuesRef[name], x, 0, z);
      issueShapes[name] = shape;
      scene.add(shape);
    });
  }

  function buildShape(data, x, y, z) {
    var sizeScale = 0.5 + (data.priority / 100) * 2;
    var opacity   = 0.2 + (data.commitment / 100) * 0.8;

    var color = new THREE.Color();
    color.setHSL(0.6 - (data.position / 100) * 0.6, 0.7, 0.5);

    var geometry;
    if (data.authority < 33) {
      geometry = new THREE.TetrahedronGeometry(sizeScale, 0);    // individual
    } else if (data.authority < 67) {
      geometry = new THREE.OctahedronGeometry(sizeScale, 0);     // state
    } else {
      geometry = new THREE.IcosahedronGeometry(sizeScale, 0);    // federal
    }

    var material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: opacity,
      shininess: 30,
      side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    // Gold wireframe overlay
    var edgeGeo = new THREE.EdgesGeometry(geometry);
    var edgeMat = new THREE.LineBasicMaterial({
      color: WIREFRAME_COLOR,
      transparent: true,
      opacity: opacity * 0.5
    });
    mesh.add(new THREE.LineSegments(edgeGeo, edgeMat));

    return mesh;
  }

  // ── Input handling ─────────────────────────────────────
  function bindInputs(canvas) {
    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('wheel',      onWheel, { passive: false });

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);
  }

  function onMouseDown(e) {
    isDragging = true;
    prev = { x: e.clientX, y: e.clientY };
  }
  function onMouseMove(e) {
    if (!isDragging) return;
    rotationY += (e.clientX - prev.x) * 0.005;
    rotationX += (e.clientY - prev.y) * 0.005;
    rotationX  = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
    prev = { x: e.clientX, y: e.clientY };
  }
  function onMouseUp()  { isDragging = false; }
  function onWheel(e) {
    e.preventDefault();
    camera.position.z += e.deltaY * 0.01;
    camera.position.z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, camera.position.z));
  }

  function onTouchStart(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }
  function onTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    rotationY += (e.touches[0].clientX - prev.x) * 0.005;
    rotationX += (e.touches[0].clientY - prev.y) * 0.005;
    rotationX  = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
    prev = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd() { isDragging = false; }

  function onResize(container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // ── Render loop ────────────────────────────────────────
  function animate() {
    requestAnimationFrame(animate);

    scene.rotation.x = rotationX;
    scene.rotation.y = rotationY;

    if (!isDragging) rotationY += 0.001;

    // Per-shape bob + spin
    var keys = Object.keys(issueShapes);
    keys.forEach(function (name, i) {
      var shape = issueShapes[name];
      shape.position.y = Math.sin(Date.now() * 0.001 + i) * 0.3;
      shape.rotation.y += 0.005;
    });

    renderer.render(scene, camera);
  }

  // ── Expose ─────────────────────────────────────────────
  global.Constellation = {
    init:        init,
    updateShape: updateShape
  };

})(window);
