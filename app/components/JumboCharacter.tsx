'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function JumboCharacter() {
  const [position, setPosition] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isThrowing, setIsThrowing] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const moveCharacter = () => {
      if (!containerRef.current || !characterRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const characterWidth = characterRef.current.offsetWidth;
      const newPosition = position + direction * 3; // 增加移動速度

      // 檢查是否到達邊界
      if (newPosition <= 0 || newPosition >= containerWidth - characterWidth) {
        setDirection(-direction);
      }

      setPosition(newPosition);
    };

    const jumpRandomly = () => {
      if (Math.random() < 0.008 && !isJumping) { // 稍微降低跳躍機率
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 400); // 縮短跳躍時間
      }
    };

    const throwRandomly = () => {
      if (Math.random() < 0.003 && !isThrowing) { // 降低甩拐杖機率
        setIsThrowing(true);
        setTimeout(() => setIsThrowing(false), 200); // 縮短甩拐杖時間
      }
    };

    const animationFrame = requestAnimationFrame(() => {
      moveCharacter();
      jumpRandomly();
      throwRandomly();
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [position, direction, isJumping, isThrowing]);

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-0 left-0 w-full h-20 overflow-visible pointer-events-none z-50"
    >
      <div
        ref={characterRef}
        className="absolute bottom-0 transition-all duration-100"
        style={{
          transform: `translateX(${position}px) translateY(${isJumping ? '-40px' : '0'})`,
          left: 0,
        }}
      >
        <div className={`relative ${isThrowing ? 'animate-throw' : ''}`}>
          <Image
            src="/jumbo-ko.png"
            alt="Jumbo Character"
            width={64}
            height={64}
            className={`transform ${direction === -1 ? 'scale-x-[-1]' : ''}`}
            priority
          />
        </div>
      </div>
    </div>
  );
} 