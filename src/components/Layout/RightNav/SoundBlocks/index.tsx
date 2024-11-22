import SoundBlock from './SoundBlock';
import { SoundData } from '@/lib/sound-data';
export const SoundBlocks = () => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {SoundData.map((sound) => (
        <SoundBlock
          key={sound.id}
          id={sound.id}
          name={sound.name}
          imgUrl={sound.imgUrl}
          url={sound.url}
        />
      ))}
    </div>
  );
};
