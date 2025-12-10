"use client";
import {useEffect, useRef} from "react";
import * as THREE from "three";

export default function Avatar3D() {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const size = 36;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 3.8;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        renderer.setSize(size, size);
        mountRef.current.appendChild(renderer.domElement);

        // Загружаем текстуру
        const texture = new THREE.TextureLoader().load("/logo.png");

        // 6 сторон куба используют одну и ту же картинку
        const materials = [
            new THREE.MeshBasicMaterial({map: texture}),
            new THREE.MeshBasicMaterial({map: texture}),
            new THREE.MeshBasicMaterial({map: texture}),
            new THREE.MeshBasicMaterial({map: texture}),
            new THREE.MeshBasicMaterial({map: texture}),
            new THREE.MeshBasicMaterial({map: texture}),
        ];

        const geometry = new THREE.BoxGeometry(1.7, 1.7, 1.7);
        const cube = new THREE.Mesh(geometry, materials);

        scene.add(cube);

        // Анимация куба
        const animate = () => {
            cube.rotation.y += 0.02;
            cube.rotation.x += 0.01;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: 36,
                height: 36,
                borderRadius: "6px",
                overflow: "hidden",
            }}
        />
    );
}
