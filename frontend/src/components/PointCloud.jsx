import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export default function PointCloud({ points}) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!points.length) return;

    // Scene - 3D world
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(50))

    // Camera - viewpoint for scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = -2;
    camera.position.z = -2;

    // Renderer - canvas for scene
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Geometry - shape data, position of points - convert point to geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // Geometry - map colors
    const colorMap = { red: 0xff0000, orange: 0xffa500, green: 0x00ff00 };
    const colors = new Float32Array(points.flatMap(p => {
      const c = new THREE.Color(colorMap[p.color] || 0xffffff);
      return [c.r, c.g, c.b];
    }));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material - look for geometry (shape, size, transparency)
    const material = new THREE.PointsMaterial({size: 0.05, vertexColors: true });

    // Combine geometry and material
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);    

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [points]);

  return (
    <div className="point-cloud-container" ref={mountRef}></div>
  )
}