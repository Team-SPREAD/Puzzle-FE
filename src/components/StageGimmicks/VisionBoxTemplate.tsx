import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useEffect, useState } from 'react';
import { LayerType, VisionLayer } from '@/lib/types';
import { VisionBoxProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { STAGE_GIMMICKS } from './configs';
import { useSelf } from '@liveblocks/react'; // 현재 사용자 정보 가져오기 위한 import

export default function VisionBoxTemplate({
  id,
  color,
  position,
}: VisionBoxProps) {
  const [content, setContent] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true); // 박스 접힘 상태 관리

  // 현재 사용자 정보 가져오기
  const me = useSelf();

  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  // 내용 업데이트 mutation
  const updateContent = useMutation(({ storage }, newContent: string) => {
    const visionBox = storage.get('layers').get(id);
    if (visionBox) {
      visionBox.update({ value: `${newContent}` }); // 포맷된 내용 업데이트
    }
  }, []);

  // 박스 복제 mutation (현재 단계의 위치에 생성)
  const duplicateBox = useMutation(
    ({ storage }) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = `vision-${Date.now()}`;

      // 현재 단계의 위치 정보를 가져와서 새로운 박스의 위치 설정
      const currentStage = 2; // 현재 2단계라고 가정합니다.
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      // 새로운 박스를 기존 박스의 위치에서 조금 옮겨서 생성
      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 450;
      const newY = basePosition.y + 1100;

      // 새로운 VisionLayer 추가
      const newLayer: VisionLayer = {
        type: LayerType.Vision,
        x: newX,
        y: newY,
        width: 230,
        height: 130,
        value: `${content}`,
        fill: color,
        borderColor: { r: 255, g: 223, b: 120 },
        fontStyle: "'Cute Font', 'Nanum Pen Script', cursive",
        iconUrl: avatar, // 현재 사용자의 아바타 URL 사용
      };

      // LiveObject로 새로운 Layer 생성
      const newLiveLayer = new LiveObject(newLayer);

      // Liveblocks storage에 추가
      layers.set(newId, newLiveLayer);
      layerIds.push(newId);
      setContent('');
    },
    [content, color, avatar],
  );

  useEffect(() => {
    updateContent(content);
  }, [content, updateContent]);

  // 박스 접힘 상태를 토글하는 함수
  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
      animate={{
        x: position.x,
        y: position.y,
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '320px',
      }}
      initial={{
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '320px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 30 }}
    >
      <div className={`p-4 ${isCollapsed ? 'px-3 py-2' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-medium text-gray-700 flex items-center">
            
            나의 비전은?
          </span>
          <button
            onClick={toggleCollapse}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            {isCollapsed ? (
              // 창 크기 키우기 아이콘 (빈칸 네모로 수정)
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect
                  x="4"
                  y="4"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            ) : (
              // 언더바 모양 아이콘 (접기)
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="4" y="11" width="16" height="2" />
              </svg>
            )}
          </button>
        </div>

        {/* 박스 내용 (접힌 상태에 따라 조건부 렌더링) */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 프로젝트를 통해 이루고 싶은 것, 기대하는 것을 자유롭게 작성해주세요."
              className="w-full h-32 p-3 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 
                bg-blue-50/30 border-blue-100 focus:border-blue-300 focus:ring-blue-200 transition-colors"
            />
            <button
              onClick={() => {
                duplicateBox();
                setContent('');
              }}
              className="mt-2 p-2 bg-blue-500 text-white rounded-lg w-full text-center"
            >
              등록하기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
