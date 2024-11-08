import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useEffect, useState } from 'react';
import { LayerType, UserStoryLayer } from '@/lib/types';
import { UserStoryProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { STAGE_GIMMICKS } from './configs';
import { useSelf } from '@liveblocks/react'; // 현재 사용자 정보 가져오기 위한 import

export default function UserStoryTemplate({
  id,
  color,
  position,
}: UserStoryProps) {
  const [who, setWho] = useState('');
  const [action, setAction] = useState('');
  const [goal, setGoal] = useState('');
  const [task, setTask] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false); // 박스 접힘 상태 관리

  // 현재 사용자 정보 가져오기
  const me = useSelf();

  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  // 내용 업데이트 mutation
  const updateContent = useMutation(
    ({ storage }) => {
      const userStoryBox = storage.get('layers').get(id);
      if (userStoryBox) {
        userStoryBox.update({
          who: `${who}`,
          action: `${action}`,
          goal: `${goal}`,
          task: `${task}`,
        }); // 포맷된 내용 업데이트
      }
    },
    [who, action, goal, task],
  );

  // 박스 복제 mutation (현재 단계의 위치에 생성)
  const duplicateBox = useMutation(
    ({ storage }, type) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = `user-story-${Date.now()}`;

      // 현재 단계의 위치 정보를 가져와서 새로운 박스의 위치 설정
      const currentStage = 8;
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      // 새로운 박스를 기존 박스의 위치에서 조금 옮겨서 생성
      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 450;
      const newY = basePosition.y + 7100;

      // 색상 설정 (Who, Goal, Action, Task에 따라 다르게 적용)
      let fillColor;
      switch (type) {
        case 'who':
          fillColor = { r: 135, g: 206, b: 235 }; // 하늘색
          break;
        case 'goal':
          fillColor = { r: 144, g: 238, b: 144 }; // 연두색
          break;
        case 'action':
          fillColor = { r: 221, g: 160, b: 221 }; // 보라색
          break;
        case 'task':
          fillColor = { r: 255, g: 182, b: 193 }; // 분홍색
          break;
        default:
          fillColor = color;
      }

      // 새로운 UserStoryLayer 추가
      const newLayer: UserStoryLayer = {
        type: LayerType.UserStory,
        x: newX,
        y: newY,
        width: 160,
        height: 160,
        who: type === 'who' ? who : '',
        action: type === 'action' ? action : '',
        goal: type === 'goal' ? goal : '',
        task: type === 'task' ? task : '',
        fill: fillColor,
        borderColor: { r: 255, g: 223, b: 120 },
        fontStyle: "'Cute Font', 'Nanum Pen Script', cursive",
        iconUrl: avatar, // 현재 사용자의 아바타 URL 사용
      };

      // LiveObject로 새로운 Layer 생성
      const newLiveLayer = new LiveObject(newLayer);

      // Liveblocks storage에 추가
      layers.set(newId, newLiveLayer);
      layerIds.push(newId);

      // 입력 필드 초기화
      switch (type) {
        case 'who':
          setWho('');
          break;
        case 'goal':
          setGoal('');
          break;
        case 'action':
          setAction('');
          break;
        case 'task':
          setTask('');
          break;
        default:
          break;
      }
    },
    [who, action, goal, task, color, avatar],
  );

  useEffect(() => {
    updateContent();
  }, [who, action, goal, task, updateContent]);

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
        width: isCollapsed ? '180px' : '400px',
      }}
      initial={{
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '400px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 9999 }}
    >
      <div className={`p-4 ${isCollapsed ? 'px-3 py-2' : ''}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-medium text-gray-700 flex items-center">
              사용자 스토리
            </span>
            <button
              onClick={toggleCollapse}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              {isCollapsed ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
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
          {/* 입력폼, 접혀 있을 때 숨김 */}
          {!isCollapsed && (
            <>
              <div className="flex flex-col items-start gap-4">
                <div className="flex gap-2 items-center w-full">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    Who
                  </span>
                  <input
                    value={who}
                    onChange={(e) => setWho(e.target.value)}
                    placeholder="사용자 (예: 사용자)"
                    className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 border-blue-100 focus:border-blue-300 focus:ring-blue-200"
                  />
                  <button
                    onClick={() => duplicateBox('who')}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md ml-2"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 items-center w-full">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-md">
                    Goal
                  </span>
                  <input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="목적 (예: 목적을 달성하기 위해)"
                    className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 border-green-100 focus:border-green-300 focus:ring-green-200"
                  />
                  <button
                    onClick={() => duplicateBox('goal')}
                    className="bg-green-500 text-white px-3 py-1 rounded-md ml-2"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 items-center w-full">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-md">
                    Action
                  </span>
                  <input
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    placeholder="활동/작업 (예: ~기능을 사용한다)"
                    className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                  />
                  <button
                    onClick={() => duplicateBox('action')}
                    className="bg-purple-500 text-white px-3 py-1 rounded-md ml-2"
                  >
                    Add
                  </button>
                </div>
                <div className="flex gap-2 items-center w-full">
                  <span className="bg-pink-500 text-white px-3 py-1 rounded-md">
                    Task
                  </span>
                  <input
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="세부 작업 (예: 특정 작업을 수행한다)"
                    className="w-full p-2 text-sm border rounded-lg focus:outline-none focus:ring-2 border-pink-100 focus:border-pink-300 focus:ring-pink-200"
                  />
                  <button
                    onClick={() => duplicateBox('task')}
                    className="bg-pink-500 text-white px-3 py-1 rounded-md ml-2"
                  >
                    Add
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
