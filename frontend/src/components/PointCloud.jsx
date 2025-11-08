import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TbUpload } from "react-icons/tb";
import "./PointCloud.css"


export default function PointCloud({ points, colorMode, filename }) {
  const mountRef = useRef(null);  
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const pointCloudRef = useRef(null);

  // Create animeted layout with scene, camera, renderer and controls with DOM
  useEffect(() => {
    if (!points.length) return;

    // Access for main <div>
    const mount = mountRef.current;

    // Scene - 3D world
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(40))
    sceneRef.current = scene;

    // Camera - viewpoint for scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-4, 0, 0);
    cameraRef.current = camera;

    // Renderer - canvas for scene
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry - shape data, position of points - convert point to geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // Geometry - default color
    const colors = new Float32Array(points.flatMap(() => [1, 1, 1]));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material - look for geometry (shape, size, transparency)
    const material = new THREE.PointsMaterial({size: 0.05, vertexColors: true });

    // Combine geometry and material
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    pointCloudRef.current = pointCloud; 

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mount.removeChild(renderer.domElement)
    };
  }, [points]);

  useEffect(() => {
    const pointCloud = pointCloudRef.current;
    if (!pointCloud) return;

    const geometry = pointCloud.geometry;
    const colors = geometry.getAttribute("color");
    const positions = geometry.getAttribute("position");
    const n = positions.count; // number of points

    const RED = new THREE.Color(0xff0000);
    const ORANGE = new THREE.Color(0xffa500);
    const GREEN = new THREE.Color(0x00ff00);
    const WHITE = new THREE.Color(0xffffff);

    for (let i = 0; i < n; i++) {
      let z = positions.getY(i); // Get the z element (from .txt) in Three.js the height is Y ax.
      let color;

      if (colorMode === "colored") {
        if (z < -1) {
          color = RED;
        } else if (z >= -1 && z < 0.5) {
          color = ORANGE;
        } else color = GREEN;
      } else {
        color = WHITE;
      }

      colors.setXYZ(i, color.r, color.g, color.b);
    }
    colors.needsUpdate = true;
  }, [colorMode, points])

  return (
    <div className="app-container">
      <div className="point-cloud-container" ref={mountRef}></div>
      {!points.length && (
          <div className="overlay-message">
            <TbUpload size={48}/>
            <p>Drop a .txt file or select one from the Menu</p>
          </div>
        )}
        {points.length > 0 && filename && (
        <div className="file-info">
          <p>Selected file: {filename}</p>
        </div>
        )}
    </div>    
  )
}