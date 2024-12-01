// pages/clock.tsx
"use client"
import React, { useRef, useEffect } from "react";
import ClockFace from "./_components/ClockFace";
import { AstronomyProvider } from "../../context/AstronomyContext";
import * as THREE from "three";

export default function ClockPage() {
  const containerRef = useRef<HTMLDivElement>(null); // Ref für den Hintergrund-Container

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, uniforms: any;

    function init() {
      // Initialize Scene, Camera, and Renderer
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true }); // Transparent background
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.zIndex = "-1";

      // Append Renderer to DOM using Ref
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      } else {
        return;
      }

      // Initialize Uniforms
      uniforms = {
        iTime: { value: 0.0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector2(0, 0) },
      };

      // Vertex Shader
      const vertexShader = `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      // Fragment Shader
      const fragmentShader = `
        uniform float iTime;
        uniform vec2 iResolution;

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));
          gl_FragColor = vec4(col, 1.0);
        }
      `;

      // Create Material
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      const plane = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(plane, material);
      scene.add(quad);

      // Render the scene
      renderer.render(scene, camera);

      // Start Animation
      animate();
    }

    function animate() {
      uniforms.iTime.value += 0.005; // Verlangsamt die Animation
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    function onWindowResize() {
      uniforms.iResolution.value.x = window.innerWidth;
      uniforms.iResolution.value.y = window.innerHeight;
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onMouseMove(event: MouseEvent) {
      uniforms.iMouse.value.x = event.clientX;
      uniforms.iMouse.value.y = event.clientY;
    }

    // Add Event Listeners
    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("mousemove", onMouseMove, false);

    // Initialize Three.js
    init();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <AstronomyProvider>
        <div
          ref={containerRef} // Ref für Hintergrund
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden", // Prevents scrolling
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Zentriert den Inhalt
          }}
        >
          <ClockFace />
        </div>
      </AstronomyProvider>
    </main>
  );
}
