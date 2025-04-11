'use client';

import { useEffect, useRef } from 'react';

export default function JumboCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // 角色狀態
  const characterState = useRef({
    position: 0,
    direction: 1,
    isJumping: false,
    isThrowing: false,
    containerWidth: 0,
    containerHeight: 0,
    image: null as HTMLImageElement | null,
    imageLoaded: false
  });

  useEffect(() => {
    // 載入角色圖片
    const img = new Image();
    img.src = '/jumbo-ko.png';
    img.onload = () => {
      characterState.current.image = img;
      characterState.current.imageLoaded = true;
    };
    
    // 設置容器尺寸
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const container = canvas.parentElement;
        
        if (container) {
          // 清除先前的配置
          canvas.width = window.innerWidth;
          canvas.height = 80; // 足夠的高度放置角色
          
          characterState.current.containerWidth = window.innerWidth;
          characterState.current.containerHeight = 80;
        }
      }
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    let lastTimestamp = 0;
    
    const animate = (timestamp: number) => {
      if (!characterState.current.imageLoaded || !canvasRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // 計算時間差，實現平滑動畫
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // 清除整個畫布
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      const { position, direction, isJumping, image, containerWidth } = characterState.current;
      
      if (!image) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // 角色尺寸
      const characterWidth = 64;
      const characterHeight = 64;
      
      // 使用時間差計算移動距離
      const speed = 0.1; // 降低速度
      const distance = speed * deltaTime * direction;
      let newPosition = position + distance;
      
      // 檢查是否到達邊界
      if (newPosition <= 0 || newPosition >= containerWidth - characterWidth) {
        characterState.current.direction *= -1;
        newPosition = Math.max(0, Math.min(newPosition, containerWidth - characterWidth));
      }
      
      characterState.current.position = newPosition;
      
      // 隨機跳躍
      if (Math.random() < 0.001 * deltaTime / 16 && !isJumping) {
        characterState.current.isJumping = true;
        setTimeout(() => {
          characterState.current.isJumping = false;
        }, 400);
      }
      
      // 計算Y位置 (跳躍效果)
      const jumpHeight = isJumping ? -40 * Math.sin(Date.now() % 400 / 400 * Math.PI) : 0;
      
      // 繪製角色
      const drawX = position;
      const drawY = canvasRef.current.height - characterHeight + jumpHeight;
      
      // 繪製時考慮方向
      if (direction > 0) {
        // 面向右邊
        ctx.drawImage(image, drawX, drawY, characterWidth, characterHeight);
      } else {
        // 面向左邊 (水平翻轉)
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(image, -drawX - characterWidth, drawY, characterWidth, characterHeight);
        ctx.restore();
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // 清理
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full overflow-visible pointer-events-none z-50">
      <canvas 
        ref={canvasRef}
        className="w-full"
        style={{
          imageRendering: 'crisp-edges',
          touchAction: 'none'
        }}
      />
    </div>
  );
} 