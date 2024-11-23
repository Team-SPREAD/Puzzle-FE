import { motion } from 'framer-motion';
import { useMutation } from '@/liveblocks.config';
import { useEffect, useState } from 'react';
import { LayerType, UserStoryLayer } from '@/lib/types';
import { UserStoryProps } from './types';
import { LiveObject } from '@liveblocks/client';
import { STAGE_GIMMICKS } from './configs';
import { useSelf } from '@liveblocks/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function UserStoryTemplate({
  id,
  color,
  position,
}: UserStoryProps) {
  const [who, setWho] = useState('');
  const [action, setAction] = useState('');
  const [goal, setGoal] = useState('');
  const [task, setTask] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);

  const me = useSelf();
  const userName = me?.info?.name || '익명 사용자';
  const avatar = me?.info?.avatar;

  const updateContent = useMutation(
    ({ storage }) => {
      const userStoryBox = storage.get('layers').get(id);
      if (userStoryBox) {
        userStoryBox.update({
          who: who,
          action: action,
          goal: goal,
          task: task,
        });
      }
    },
    [who, action, goal, task],
  );

  const duplicateBox = useMutation(
    ({ storage }, type) => {
      const layers = storage.get('layers');
      const layerIds = storage.get('layerIds');
      const newId = `user-story-${Date.now()}`;

      const currentStage = 8;
      const stageGimmick = STAGE_GIMMICKS[currentStage];
      if (!stageGimmick) {
        console.error('Invalid stage');
        return;
      }

      const basePosition = stageGimmick.boxes[0].position;
      const newX = basePosition.x + 450;
      const newY = basePosition.y + 7100;

      let fillColor;
      switch (type) {
        case 'who':
          fillColor = { r: 135, g: 206, b: 235 };
          break;
        case 'goal':
          fillColor = { r: 144, g: 238, b: 144 };
          break;
        case 'action':
          fillColor = { r: 221, g: 160, b: 221 };
          break;
        case 'task':
          fillColor = { r: 255, g: 182, b: 193 };
          break;
        default:
          fillColor = color;
      }

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
        iconUrl: avatar,
      };

      const newLiveLayer = new LiveObject(newLayer);
      layers.set(newId, newLiveLayer);
      layerIds.push(newId);

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
      }
    },
    [who, action, goal, task, color, avatar],
  );

  useEffect(() => {
    updateContent();
  }, [who, action, goal, task, updateContent]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="absolute bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50"
      animate={{
        x: position.x,
        y: position.y,
        height: isCollapsed ? '48px' : 'auto',
        width: isCollapsed ? '200px' : '380px',
      }}
      initial={{
        height: isCollapsed ? '48px' : 'auto',
        width: isCollapsed ? '200px' : '380px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'absolute', zIndex: 30 }}
    >
      <div className="p-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                유저 스토리
              </span>

              {avatar && (
                <div className="relative w-6 h-6">
                  <Image
                    src={avatar}
                    alt={userName}
                    fill
                    sizes="24px"
                    className="rounded-full border border-gray-200 object-cover"
                    priority
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col gap-3">
              {[
                { type: 'who', color: 'blue', value: who, setValue: setWho },
                {
                  type: 'goal',
                  color: 'green',
                  value: goal,
                  setValue: setGoal,
                },
                {
                  type: 'action',
                  color: 'purple',
                  value: action,
                  setValue: setAction,
                },
                { type: 'task', color: 'pink', value: task, setValue: setTask },
              ].map(({ type, color, value, setValue }) => (
                <div key={type} className="flex gap-2 items-center">
                  <div
                    className={`flex-1 flex gap-2 p-2 rounded-lg bg-${color}-50 border border-${color}-100`}
                  >
                    <span
                      className={`flex-shrink-0 bg-${color}-500 text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize`}
                    >
                      {type}
                    </span>
                    <input
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={`Enter ${type}...`}
                      className={cn(
                        'flex-1 bg-transparent border-none text-sm',
                        'placeholder:text-gray-400',
                        'focus:outline-none focus:ring-0',
                        `text-${color}-700`,
                      )}
                    />
                  </div>
                  <button
                    onClick={() => duplicateBox(type)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      `bg-${color}-500 hover:bg-${color}-600`,
                      'text-white text-sm font-medium',
                    )}
                  >
                    추가
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
