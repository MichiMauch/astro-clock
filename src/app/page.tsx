"use client";
import React, { useEffect, useRef } from "react";
import ClockFace from "./clock/_components/ClockFace";
import { AstronomyProvider } from "../context/AstronomyContext";
import MoonCard from "./cards/_components/MoonCard";
import SunCard from "./cards/_components/SunCard";
import "./cards/styles.css";
import * as THREE from "three";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null); // Ref für den Hintergrund-Container

  useEffect(() => {
    let scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer;
    let uniforms: {
      iTime: { value: number };
      iResolution: { value: THREE.Vector2 };
      iMouse: { value: THREE.Vector2 };
    };

    function init() {
      console.log("Initializing stars...");
      scene = new THREE.Scene();
      camera = new THREE.Camera();
      camera.position.z = 1;

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.top = "0";
      renderer.domElement.style.left = "0";
      renderer.domElement.style.zIndex = "-1"; // Setze z-index für Sterne

      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      } else {
        console.error("Container not found");
        return;
      }

      uniforms = {
        iTime: { value: 0.0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        iMouse: { value: new THREE.Vector2(0, 0) }
      };

      const vertexShader = `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        // Star Nest by Pablo Roman Andrioli
        // License: MIT

        #define iterations 17
        #define formuparam 0.53

        #define volsteps 20
        #define stepsize 0.1

        #define zoom   0.800
        #define tile   0.850
        #define speed  0.004  // Further reduce the speed value to slow down the animation

        #define brightness 0.0015
        #define darkmatter 0.300
        #define distfading 0.730
        #define saturation 0.850

        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec2 iMouse;

        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
          //get coords and direction
          vec2 uv = fragCoord.xy / iResolution.xy - .5;
          uv.y *= iResolution.y / iResolution.x;
          vec3 dir = vec3(uv * zoom, 1.);
          float time = iTime * speed + .25;

          //mouse rotation
          float a1 = .5 + iMouse.x / iResolution.x * 0.5;  // Reduce the influence of the mouse on rotation
          float a2 = .8 + iMouse.y / iResolution.y * 0.5;  // Reduce the influence of the mouse on rotation
          mat2 rot1 = mat2(cos(a1), sin(a1), -sin(a1), cos(a1));
          mat2 rot2 = mat2(cos(a2), sin(a2), -sin(a2), cos(a2));
          dir.xz *= rot1;
          dir.xy *= rot2;
          vec3 from = vec3(1., .5, 0.5);
          from += vec3(time * 2., time, -2.);
          from.xz *= rot1;
          from.xy *= rot2;

          //volumetric rendering
          float s = 0.1, fade = 1.;
          vec3 v = vec3(0.);
          for (int r = 0; r < volsteps; r++) {
            vec3 p = from + s * dir * .5;
            p = abs(vec3(tile) - mod(p, vec3(tile * 2.))); // tiling fold
            float pa, a = pa = 0.;
            for (int i = 0; i < iterations; i++) {
              p = abs(p) / dot(p, p) - formuparam; // the magic formula
              a += abs(length(p) - pa); // absolute sum of average change
              pa = length(p);
            }
            float dm = max(0., darkmatter - a * a * .001); //dark matter
            a *= a * a; // add contrast
            if (r > 6) fade *= 1. - dm; // dark matter, don't render near
            v += fade;
            v += vec3(s, s * s, s * s * s * s) * a * brightness * fade; // coloring based on distance
            fade *= distfading; // distance fading
            s += stepsize;
          }
          v = mix(vec3(length(v)), v, saturation); //color adjust
          fragColor = vec4(v * .01, 1.);
        }

        void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
        }
      `;

      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      });

      const plane = new THREE.PlaneGeometry(2, 2);
      const quad = new THREE.Mesh(plane, material);
      scene.add(quad);

      animate();
    }

    function animate() {
      uniforms.iTime.value += 0.01;  // Reduce the increment to slow down the animation
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

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);

    init();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <main className="flex justify-center items-center min-h-screen relative">
      <AstronomyProvider>
        <div
          ref={containerRef}
          className="w-full h-full flex flex-col lg:flex-row justify-center items-center lg:space-x-8 px-8" // Tailwind CSS-Klassen verwenden
        >
          <MoonCard />
          <ClockFace />
          <SunCard />
        </div>
      </AstronomyProvider>
    </main>
  );
}
