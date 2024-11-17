import { useState, useEffect } from 'react';

export const useVoteAnimation = (isCompleted: boolean, totalUsers: number) => {
  const [showTransform, setShowTransform] = useState(false);

  useEffect(() => {
    if (isCompleted) {
      const totalAnimationTime = 800 + (150 * (totalUsers - 1)) + 600;
      const timer = setTimeout(() => setShowTransform(true), totalAnimationTime);
      return () => clearTimeout(timer);
    }
    setShowTransform(false);
  }, [isCompleted, totalUsers]);

  return { showTransform };
};