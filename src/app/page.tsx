'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GoogleLoginButton from '@/components/GoogleLogin';
import PuzzlePiece from '@/components/Puzzle/PuzzleMatter';

const SECTIONS = [
  {
    step: 'STEP 1',
    title: '프로젝트 시작하기',
    description: '팀을 구성하고 프로젝트의 목표와 방향성을 설정하세요',
    image: '/api/placeholder/400/320',
  },
  {
    step: 'STEP 2',
    title: '스프린트 계획',
    description: '2주 단위로 달성 가능한 목표를 설정하고 작업을 분배하세요',
    image: '/api/placeholder/400/320',
  },
  {
    step: 'STEP 3',
    title: '실시간 협업',
    description: '팀원들과 함께 아이디어를 공유하고 발전시켜보세요',
    image: '/api/placeholder/400/320',
  },
  {
    step: 'STEP 4',
    title: '진행 상황 확인',
    description: '프로젝트의 진행 상황을 실시간으로 모니터링하세요',
    image: '/api/placeholder/400/320',
  },
];

export default function LandingPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const layoutRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (layoutRef.current) {
      const scrollPosition = layoutRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const currentSectionIndex = Math.round(scrollPosition / windowHeight);
      setCurrentSection(currentSectionIndex);
    }
  };

  useEffect(() => {
    const layout = layoutRef.current;
    if (layout) {
      layout.addEventListener('scroll', handleScroll);
      return () => layout.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleDotClick = (index: number) => {
    if (layoutRef.current) {
      layoutRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PUZZLE
          </span>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div
        ref={layoutRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        {/* Matter.js 퍼즐 */}

        {/* 첫 번째 섹션 */}
        <section className="relative h-screen w-full snap-start flex items-center justify-center">
          <div className="absolute inset-0">
            <PuzzlePiece currentSection={currentSection} />
          </div>
          <motion.div
            className="container mx-auto px-4 text-center z-40 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl text-gray-800 mb-4 mt-20">
              프로젝트 개발을 위한 가이드라인 단계 플랫폼
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              애자일 방법론으로 체계적인 프로젝트 관리와 팀원들의 창의적인
              아이디어를 하나로
            </p>
            <div className="mt-8">
              <GoogleLoginButton />
            </div>
          </motion.div>
        </section>

        {/* 나머지 섹션들 */}
        {SECTIONS.map((section, index) => (
          <section
            key={section.step}
            className="h-screen w-full snap-start flex items-center justify-center bg-white"
          >
            <motion.div
              className={`container mx-auto px-4 flex ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              } items-center gap-8 md:gap-16`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <p className="text-2xl text-blue-600 font-bold mb-2">
                  {section.step}
                </p>
                <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
                <p className="text-xl text-gray-600">{section.description}</p>
              </div>
              <div className="flex-1">
                <img
                  src={section.image}
                  alt={section.title}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </motion.div>
          </section>
        ))}
      </div>

      {/* 네비게이션 도트 */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 z-50">
        {[0, ...SECTIONS.map((_, i) => i + 1)].map((i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentSection === i ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
