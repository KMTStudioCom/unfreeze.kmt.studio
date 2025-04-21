'use client';

import { useEffect, useRef } from 'react';

export default function JumboChoCharacter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // 角色狀態
  const characterState = useRef({
    position: 0,
    direction: 1,
    isJumping: false,
    jumpStartTime: 0,
    jumpDuration: 600, // 跳躍持續時間（毫秒）- 比 jumbo-ko 更長
    containerWidth: 0,
    containerHeight: 0,
    image: null as HTMLImageElement | null,
    imageLoaded: false
  });

  // 點擊彩蛋功能
  const triggerJump = () => {
    if (!characterState.current.isJumping) {
      characterState.current.isJumping = true;
      characterState.current.jumpStartTime = Date.now();
      
      setTimeout(() => {
        characterState.current.isJumping = false;
      }, characterState.current.jumpDuration);
    }
  };

  useEffect(() => {
    // 載入角色圖片
    const img = new Image();
    img.src = '/jumbo-cho.png';
    img.onload = () => {
      characterState.current.image = img;
      characterState.current.imageLoaded = true;
    };
    
    // 設定容器尺寸
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        
        // 設定Canvas尺寸為視窗寬度和足夠高度
        canvas.width = window.innerWidth;
        canvas.height = 150; // 增加高度以確保跳躍時完全顯示
        
        characterState.current.containerWidth = canvas.width;
        characterState.current.containerHeight = canvas.height;
      }
    };

    // 設定點擊監聽器 - 彩蛋功能
    const handleClick = (e: MouseEvent) => {
      if (canvasRef.current && characterState.current.image) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 角色位置和尺寸
        const charX = characterState.current.position;
        const charY = canvas.height - 64; // 角色高度
        const charWidth = 64;
        const charHeight = 64;
        
        // 檢查是否點擊了角色
        if (x >= charX && x <= charX + charWidth && 
            y >= charY && y <= charY + charHeight) {
          triggerJump();
        }
      }
    };
    
    // 設定觸控監聽器 - 行動裝置支援
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0 && canvasRef.current && characterState.current.image) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        
        // 角色位置和尺寸
        const charX = characterState.current.position;
        const charY = canvas.height - 64; // 角色高度
        const charWidth = 64;
        const charHeight = 64;
        
        // 檢查是否點擊了角色
        if (x >= charX && x <= charX + charWidth && 
            y >= charY && y <= charY + charHeight) {
          triggerJump();
          e.preventDefault(); // 防止觸發滾動等行為
        }
      }
    };
    
    window.addEventListener('resize', updateCanvasSize);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('touchstart', handleTouch);
    }
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
      
      // 角色尺寸 - 保持正確的寬高比
      const characterWidth = 64;
      const characterHeight = 64;
      
      // 使用時間差計算移動距離
      const speed = 0.15; // 移動速度 - 比 jumbo-ko 更慢
      const distance = speed * deltaTime * direction;
      let newPosition = position + distance;
      
      // 檢查是否到達邊界
      if (newPosition <= 0 || newPosition >= containerWidth - characterWidth) {
        characterState.current.direction *= -1;
        newPosition = Math.max(0, Math.min(newPosition, containerWidth - characterWidth));
      }
      
      characterState.current.position = newPosition;
      
      // 隨機跳躍 - 不同的跳躍機率
      if (Math.random() < 0.0035 * deltaTime / 16 && !isJumping) {
        triggerJump();
      }
      
      // 計算Y位置 (跳躍效果)
      let jumpHeight = 0;
      
      // 簡單跳躍動畫
      if (isJumping) {
        const jumpProgress = (Date.now() - characterState.current.jumpStartTime) / characterState.current.jumpDuration;
        if (jumpProgress <= 1) {
          // 拋物線跳躍，模擬簡單重力效果
          jumpHeight = -70 * Math.sin(jumpProgress * Math.PI); // 跳得更高
        }
      }
      
      // 繪製角色 - 確保底部完全貼合Canvas底部
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
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
        canvas.removeEventListener('touchstart', handleTouch);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed bottom-0 right-0 w-full overflow-visible pointer-events-none" style={{ height: '150px' }}>
      <canvas 
        ref={canvasRef}
        className="absolute bottom-0 left-0 w-full"
        style={{
          imageRendering: 'crisp-edges',
          touchAction: 'none',
          pointerEvents: 'auto' // 允許接收點擊事件
        }}
      />
    </div>
  );
} 