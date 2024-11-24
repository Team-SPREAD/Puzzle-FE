import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '@/store/useDarkModeStore';

const PricingPage = () => {
  const { isDarkMode } = useDarkMode();

  const plans = [
    {
      name: 'Free',
      price: '₩0',
      period: '무료',
      description: '개인 사용자를 위한 기본 플랜',
      features: [
        { text: '개인 프로젝트 3개', included: true },
        { text: '기본 템플릿 접근', included: true },
        { text: '1GB 저장 공간', included: true },
        { text: '이메일 지원', included: true },
        { text: '팀 협업 기능', included: false },
        { text: '고급 분석 기능', included: false }
      ],
      buttonText: '현재 플랜',
      popular: false
    },
    {
      name: 'Pro',
      price: '₩12,000',
      period: '월',
      description: '전문가와 소규모 팀을 위한 플랜',
      features: [
        { text: '무제한 프로젝트', included: true },
        { text: '모든 템플릿 접근', included: true },
        { text: '10GB 저장 공간', included: true },
        { text: '24/7 이메일 지원', included: true },
        { text: '팀 협업 기능', included: true },
        { text: '고급 분석 기능', included: true }
      ],
      buttonText: '업그레이드',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '₩49,000',
      period: '월',
      description: '대규모 팀과 기업을 위한 플랜',
      features: [
        { text: '무제한 프로젝트', included: true },
        { text: '모든 템플릿 접근', included: true },
        { text: '무제한 저장 공간', included: true },
        { text: '24/7 전담 지원', included: true },
        { text: '고급 팀 협업 기능', included: true },
        { text: '맞춤형 기능 개발', included: true }
      ],
      buttonText: '문의하기',
      popular: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Simple, transparent pricing
        </h2>
        <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          프로젝트의 규모에 맞는 최적의 요금제를 선택하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-xl shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } ${plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="mb-4">
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline mb-6">
                <span className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                </span>
                <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  /{plan.period}
                </span>
              </div>

              <ul className="mb-6 space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mr-3" />
                    )}
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-colors
                  ${plan.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          모든 요금제는 부가세가 별도로 부과됩니다. 
          자세한 내용은 <button className="text-blue-500 hover:underline">이용약관</button>을 참고해주세요.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;