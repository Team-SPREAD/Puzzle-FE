import { nanoid } from 'nanoid';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Node, Position } from 'reactflow';

const COLORS = [
  'rgba(128, 140, 160, 1)', // Bright and saturated navy blue
  'rgba(100, 140, 190, 1)', // Bright and saturated cobalt blue
  'rgba(190, 100, 100, 1)', // Bright and saturated crimson
  'rgba(190, 190, 100, 1)', // Bright and saturated golden yellow
  'rgba(100, 190, 100, 1)', // Bright and saturated kelly green
  'rgba(100, 190, 190, 1)', // Bright and saturated turquoise
  'rgba(190, 100, 190, 1)', // Bright and saturated magenta
  'rgba(160, 160, 160, 1)', // Bright and saturated medium gray
];

const InputForNode = ({
  addWhatNode,
}: {
  addWhatNode: (node: Node) => void;
}) => {
  const [label, setLabel] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false); // 박스 접힘 상태 관리

  const onChangeLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleClick = () => {
    const id = nanoid();

    const position = {
      x: Math.floor(Math.random() * (500 - 300) + 300),
      y: Math.floor(Math.random() * (500 - 300)) + 300,
    };

    type Parent = 'parent';

    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    const newNode = {
      id,
      position,
      type: 'input',
      style: {
        borderColor: color,
        width: '250px',
        height: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        fontWeight: 'normal',
        color: 'black',
      },
      data: {
        label,
        color,
      },
      sourcePosition: 'right' as Position,
      // parentId: 'AREA',
      extent: 'parent' as Parent,
    };

    addWhatNode(newNode);
    setLabel('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

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
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '487px',
      }}
      initial={{
        height: isCollapsed ? '50px' : 'auto',
        width: isCollapsed ? '180px' : '487px',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        position: 'absolute',
        bottom: '8rem',
        left: '8rem',
        zIndex: 30,
      }}
    >
      <div className={`p-4 ${isCollapsed ? 'px-3 py-2' : ''}`}>
        <div className="flex items-center justify-between ">
          <span className="text-base font-medium text-gray-700 flex items-center">
            노드 추가하기
          </span>
          <button
            onClick={toggleCollapse}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            {isCollapsed ? (
              // 창 크기 키우기 아이콘 (빈칸 네모로 수정)
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
            <input
              type="text"
              placeholder="노드를 추가해보세요"
              value={label}
              className="w-full p-3 mb-2 text-sm border rounded-lg focus:outline-none focus:ring-2 
                  bg-indigo-50/30 border-indigo-100 focus:border-indigo-300 focus:ring-indigo-200
                  resize-none"
              onChange={onChangeLabel}
              onKeyPress={handleKeyPress}
            />
            <button
              className="w-full p-2.5  bg-indigo-50 text-indigo-800 rounded-lg
                hover:bg-indigo-100 transition-colors cursor-pointer
                flex items-center justify-center gap-2"
              onClick={handleClick}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              노드 만들기
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default InputForNode;
