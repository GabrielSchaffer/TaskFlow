import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';

interface FireworksProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const colors = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4',
  '#feca57',
  '#ff9ff3',
  '#54a0ff',
  '#5f27cd',
  '#00d2d3',
  '#ff9f43',
];

export const Fireworks = ({ trigger, onComplete }: FireworksProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const createFireworks = useCallback(() => {
    const newParticles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create multiple bursts
    for (let burst = 0; burst < 3; burst++) {
      const burstX = centerX + (Math.random() - 0.5) * 200;
      const burstY = centerY + (Math.random() - 0.5) * 200;

      // Create particles for each burst
      for (let i = 0; i < 50; i++) {
        const angle = (Math.PI * 2 * i) / 50;
        const speed = 2 + Math.random() * 4;

        newParticles.push({
          id: Math.random(),
          x: burstX,
          y: burstY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2 + Math.random() * 4,
        });
      }
    }

    setParticles(newParticles);
    animateParticles();
  }, []);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      createFireworks();

      // Auto cleanup after animation
      setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, isActive, onComplete, createFireworks]);

  const animateParticles = () => {
    const animate = () => {
      setParticles(prevParticles => {
        const updatedParticles = prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: (particle.vy + 0.1) * 0.99, // gravity + friction
            life: particle.life - 0.02,
            vx: particle.vx * 0.99, // friction
          }))
          .filter(particle => particle.life > 0);

        if (updatedParticles.length > 0) {
          requestAnimationFrame(animate);
        }
        return updatedParticles;
      });
    };

    requestAnimationFrame(animate);
  };

  if (!isActive || particles.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {particles.map(particle => (
        <Box
          key={particle.id}
          sx={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.life,
            transform: `scale(${particle.life})`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transition: 'all 0.1s ease-out',
          }}
        />
      ))}
    </Box>
  );
};
