import { SoundData } from '@/lib/sound-data';
import SoundBox from './SoundBox';
import AudioPlayer from './AudioPlayer';
import Timer from './Timer';
import GroupCall from './GroupCall';
import { motion } from 'framer-motion';
import { useState } from 'react';
export default function RightNav() {
  const [isClosed, setIsClosed] = useState(false);
  return (
    <div>
      <motion.div
        animate={{
          x: isClosed ? -50 : -300,
          y: 0,
          scale: 1,
          rotate: 0,
        }}
        className="flex items-center top-40 fixed transform -translate-y-1/2"
      >
        <div className="w-4 h-6 border-[1px] border-[#F0F0F0] bg-white flex justify-center items-center">
          <p onClick={() => setIsClosed(!isClosed)} className="cursor-pointer">
            {isClosed ? 'o' : 'x'}
          </p>
        </div>
        <div className="  py-2 shadow-xl rounded-[4px] border-[1px] border-[#F0F0F0] bg-white">
          {/* 타이머 */}
          <div className="py-4 px-5">
            <Timer />
          </div>
          {/* 오디오 플레이어 */}
          <div className="py-2 px-5 ">
            <AudioPlayer />
          </div>
          {/* 사운드 블록 */}
          <div className="py-4 px-5 ">
            <div className="text-[12px]">
              <p className="mb-2">사운드 블록</p>
            </div>
            <div className="w-[200px] flex flex-wrap gap-1">
              {SoundData.map((sound) => (
                <SoundBox
                  key={sound.id}
                  id={sound.id}
                  name={sound.name}
                  imgUrl={sound.imgUrl}
                  url={sound.url}
                />
              ))}
            </div>
          </div>
          <div className="py-2 px-3">
            {/* 룸아이디 임시 */}
            <GroupCall />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
