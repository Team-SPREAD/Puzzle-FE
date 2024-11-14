import {
  VisionBoxTemplate,
  TopicVoteTemplate,
  UserStoryTemplate,
  SparedBoxTemplate,
  DiscussionBoxTemplate,
  PersonaBoxTemplate,
  FishboneBoxTemplate,
} from '.';
import { STAGE_GIMMICKS } from './configs';
import { motion } from 'framer-motion';

interface StageGimmicksProps {
  currentStep: number;
}

export default function StageGimmicks({ currentStep }: StageGimmicksProps) {
  const currentGimmick = STAGE_GIMMICKS[currentStep];
  if (!currentGimmick) return null;

  const GimmickComponent = {
    2: VisionBoxTemplate,
    3: TopicVoteTemplate,
    4: SparedBoxTemplate,
    5: DiscussionBoxTemplate,
    6: PersonaBoxTemplate,
    7: FishboneBoxTemplate,
    8: UserStoryTemplate,
  }[currentStep];

  if (!GimmickComponent) return null;

  return (
    <>
      {/* 단계별 안내 메시지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-[12%] left-[40%]  -translate-x-1/2 text-center pointer-events-none z-50"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentGimmick.title}
        </h2>
        <p className="text-gray-600">{currentGimmick.description}</p>
      </motion.div>

      {/* 단계별 기믹 박스들 */}
      {currentGimmick.boxes.map((box) => (
        <GimmickComponent key={box.id} {...box} />
      ))}
    </>
  );
}
