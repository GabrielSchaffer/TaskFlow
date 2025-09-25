import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { Confetti } from '../Animations/Confetti';
import { Fireworks } from '../Animations/Fireworks';
import { useCelebration } from '../../hooks/useCelebration';

export const AnimationTest = () => {
  const {
    showConfetti,
    showFireworks,
    triggerConfetti,
    triggerFireworks,
    triggerCelebration,
    handleConfettiComplete,
    handleFireworksComplete,
  } = useCelebration();

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Teste de Animações
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
        <Button variant="contained" color="primary" onClick={triggerConfetti}>
          Testar Confetti
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={triggerFireworks}
        >
          Testar Fireworks
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={triggerCelebration}
        >
          Testar Aleatório
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        Clique nos botões acima para testar as animações!
      </Typography>

      {/* Celebration Animations */}
      <Confetti trigger={showConfetti} onComplete={handleConfettiComplete} />
      <Fireworks trigger={showFireworks} onComplete={handleFireworksComplete} />
    </Box>
  );
};
