import { SoundData } from '@/lib/sound-data';
import SoundBox from './SoundBox';
import AudioPlayer from './AudioPlayer';
import Timer from './Timer';
import GroupCall from './GroupCall';

export default function RightNav() {
  return (
    <div className="fixed right-4 w-[240px] h-[540px]  py-2 shadow-xl rounded-[4px] border-[1px] border-[#F0F0F0]">
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
        <GroupCall roomId="1" />
      </div>
    </div>
  );
}
