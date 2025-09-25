import React, { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  shape: 'circle' | 'square' | 'triangle';
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
  '#ff4757',
  '#2ed573',
  '#1e90ff',
  '#ffa502',
  '#ff6348',
];

const shapes: ('circle' | 'square' | 'triangle')[] = [
  'circle',
  'square',
  'triangle',
];

export const Confetti = ({ trigger, onComplete }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const createConfetti = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Create confetti pieces
    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100;
      const speed = 3 + Math.random() * 6;
      const randomAngle = angle + (Math.random() - 0.5) * 0.5;

      newPieces.push({
        id: Math.random(),
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + (Math.random() - 0.5) * 100,
        vx: Math.cos(randomAngle) * speed,
        vy: Math.sin(randomAngle) * speed - 2,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: 4 + Math.random() * 8,
      });
    }

    setPieces(newPieces);
    animateConfetti();
  }, []);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      createConfetti();

      // Auto cleanup after animation
      setTimeout(() => {
        setIsActive(false);
        setPieces([]);
        onComplete?.();
      }, 4000);
    }
  }, [trigger, isActive, onComplete, createConfetti]);

  const animateConfetti = () => {
    const animate = () => {
      setPieces(prevPieces => {
        const updatedPieces = prevPieces
          .map(piece => ({
            ...piece,
            x: piece.x + piece.vx,
            y: piece.y + piece.vy,
            vy: piece.vy + 0.15, // gravity
            vx: piece.vx * 0.98, // air resistance
            rotation: piece.rotation + piece.rotationSpeed,
          }))
          .filter(piece => piece.y < window.innerHeight + 100);

        if (updatedPieces.length > 0) {
          requestAnimationFrame(animate);
        }
        return updatedPieces;
      });
    };

    requestAnimationFrame(animate);
  };

  if (!isActive || pieces.length === 0) {
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
      {pieces.map(piece => (
        <Box
          key={piece.id}
          sx={{
            position: 'absolute',
            left: piece.x,
            top: piece.y,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius:
              piece.shape === 'circle'
                ? '50%'
                : piece.shape === 'triangle'
                ? '0'
                : '2px',
            transform: `rotate(${piece.rotation}rad)`,
            opacity: Math.max(
              0,
              1 - (window.innerHeight - piece.y) / window.innerHeight
            ),
            boxShadow: `0 0 ${piece.size}px ${piece.color}`,
            transition: 'all 0.1s ease-out',
            ...(piece.shape === 'triangle' && {
              width: 0,
              height: 0,
              borderLeft: `${piece.size / 2}px solid transparent`,
              borderRight: `${piece.size / 2}px solid transparent`,
              borderBottom: `${piece.size}px solid ${piece.color}`,
              backgroundColor: 'transparent',
            }),
          }}
        />
      ))}
    </Box>
  );
};
