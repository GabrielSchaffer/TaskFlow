import { useState, useCallback } from 'react';

export const useCelebration = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const triggerFireworks = useCallback(() => {
    setShowFireworks(true);
  }, []);

  const triggerCelebration = useCallback(() => {
    console.log('🎉 Triggering celebration!');
    // Randomly choose between confetti and fireworks
    if (Math.random() > 0.5) {
      console.log('🎊 Triggering confetti');
      triggerConfetti();
    } else {
      console.log('🎆 Triggering fireworks');
      triggerFireworks();
    }
  }, [triggerConfetti, triggerFireworks]);

  const handleConfettiComplete = useCallback(() => {
    setShowConfetti(false);
  }, []);

  const handleFireworksComplete = useCallback(() => {
    setShowFireworks(false);
  }, []);

  return {
    showConfetti,
    showFireworks,
    triggerConfetti,
    triggerFireworks,
    triggerCelebration,
    handleConfettiComplete,
    handleFireworksComplete,
  };
};
