'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleLoginButton from '@/components/GoogleLogin';
import PuzzleMatter from '@/components/Puzzle/PuzzleMatter';
import {
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
} from 'lucide-react';
import GridBackground from '@/components/Puzzle/GridBackground';
import Image from 'next/image';
import { Doodle } from '@/components/Puzzle/Doodle';

const SECTIONS = [
  {
    step: 'STEP 1',
    title: '프로젝트 시작하기',
    description: '팀을 구성하고 프로젝트의 목표와 방향성을 설정하세요',
    image: '/gifs/createTeam.gif',
  },
  {
    step: 'STEP 2',
    title: '실시간 협업',
    description: '실시간으로 소통하고, 아이디어를 확장하세요',
    image: '/gifs/project_start.gif',
  },
  {
    step: 'STEP 3',
    title: '다양한 기믹과 투표 시스템',
    description: '다양한 기믹들로 가이드라인을 제시하고 투표를 통해 결정하세요',
    image: '/gifs/project_start.gif',
  },
  {
    step: 'STEP 4',
    title: '결과와 단계를 모니터링',
    description: 'Process를 확인하고 마지막 결과를 확인해보세요',
    image: '/gifs/project_start.gif',
  },
];

export default function LandingPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const handleScroll = () => {
    if (!layoutRef.current) return;

    const scrollPosition = layoutRef.current.scrollTop;
    const windowHeight = window.innerHeight;
    const sectionCount = SECTIONS.length + 1;
    const lastSectionPosition = (sectionCount - 1) * windowHeight;

    // 첫 번째 섹션을 지나갈 때 버튼 표시
    setShowFixedButton(scrollPosition > windowHeight * 0.5);

    // 헤더 표시/숨김 처리
    if (scrollPosition > lastScrollTop.current && scrollPosition > 100) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
    lastScrollTop.current = scrollPosition;

    // 현재 섹션 계산 (네비게이션 도트용)
    const currentSectionIndex = Math.floor(scrollPosition / windowHeight);
    setCurrentSection(Math.min(currentSectionIndex, sectionCount - 1));

    // 푸터 애니메이션
    if (footerRef.current) {
      if (scrollPosition >= lastSectionPosition) {
        const progress = (scrollPosition - lastSectionPosition) / windowHeight;
        footerRef.current.style.transform = `translateY(${Math.max(0, 100 - progress * 100)}%)`;
      } else {
        footerRef.current.style.transform = 'translateY(100%)';
      }
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

  const backgroundColors = [
    'bg-transparent',
    'bg-gradient-to-br from-blue-50 to-purple-50',
    'bg-gradient-to-br from-green-50 to-blue-50',
    'bg-gradient-to-br from-yellow-50 to-green-50',
    'bg-gradient-to-br from-purple-50 to-pink-50',
    'bg-gradient-to-b from-purple-50 to-white',
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fixed Get Puzzle Button */}
      <div
        className={`fixed top-6 right-8 z-50 transition-all duration-500 ${
          showFixedButton
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-[-20px] pointer-events-none'
        }`}
      >
        <button className="px-6 py-3 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#3c3c3c] shadow-lg transition-all">
          Get Puzzle!
        </button>
      </div>

      {/* Background Transition */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSection}
          className={`fixed inset-0 w-full h-full transition-colors duration-500 ease-in-out -z-10 ${backgroundColors[currentSection]}`}
        />
      </AnimatePresence>

      {/* Main Content */}
      <div ref={layoutRef} className="h-screen overflow-y-auto">
        {/* First Section */}
        <section className="relative h-screen w-full flex items-center justify-center pt-16">
          <GridBackground />
          <div className="absolute inset-0">
            <PuzzleMatter
              currentSection={currentSection}
              isVisible={isHeaderVisible}
            />
          </div>
          <div className="flex flex-col items-center justify-center h-full ml-30 mt-36">
            <motion.div
              className="container mx-auto px-4 text-center z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl text-gray-800 mb-6">
                실시간으로 폭발적인 기획을 돕는 가이드라인 제공 플랫폼
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                애자일 방법론으로 체계적인 프로젝트 관리와 팀원들의 창의적인
                아이디어를 하나로
              </p>
              <div className="ml-40">
                <GoogleLoginButton />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Middle Sections */}
        {SECTIONS.map((section, index) => (
          <section
            key={section.step}
            className="h-screen w-full flex flex-col justify-center pt-16"
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
              <div
                className={`flex-1 ${index % 2 !== 0 ? 'text-right' : ''}`} // 짝수 섹션 텍스트 우측 정렬
              >
                <p className="text-2xl text-blue-600 font-bold mb-2">
                  {section.step}
                </p>
                <h2 className="text-4xl font-bold mb-4">{section.title}</h2>
                <p className="text-xl text-gray-600">{section.description}</p>
              </div>
              <div className="flex-1 relative aspect-video">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  unoptimized
                  className="rounded-lg shadow-xl object-cover"
                />
              </div>
            </motion.div>
          </section>
        ))}

        {/* Try Puzzle Section & Footer */}
        <div ref={footerRef} className="relative bg-white">
          {/* Try Puzzle Section */}
          <section className="relative py-20 px-4 min-h-screen flex items-center justify-center">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentSection}
                className={`absolute inset-0 transition-colors duration-500 ease-in-out ${
                  currentSection === SECTIONS.length
                    ? backgroundColors[backgroundColors.length - 1]
                    : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>

            <div className="absolute left-1/2 -translate-x-1/2 -top-6">
              <ChevronDown className="w-8 h-8 text-gray-400 animate-bounce" />
            </div>
            <Doodle />
            <section className="relative py-20 px-4 min-h-screen flex items-center justify-center overflow-hidden">
              <div className="container mx-auto text-center relative z-10">
                <h2 className="text-5xl font-bold text-gray-800 mb-6">
                  Try Puzzle!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our <span className="font-semibold">free</span> beta works on
                  all desktop browsers.
                </p>
                <button className="group relative bg-[#2c2c2c] text-white px-8 py-4 rounded-lg hover:bg-[#3c3c3c] transition-all">
                  Get Puzzle Free
                  <span className="absolute inset-y-0 right-4 flex items-center">
                    →
                  </span>
                </button>
              </div>
            </section>
          </section>

          {/* Footer */}
          <footer className="bg-[#2c2c2c] text-white py-12">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-gray-400">© 2024 Puzzle</div>
                <div className="flex gap-6">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
                <div className="flex gap-6 text-sm">
                  <a
                    href="/blog"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                  <a
                    href="/help"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms and Conditions
                  </a>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Navigation Dots */}
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
    </div>
  );
}
