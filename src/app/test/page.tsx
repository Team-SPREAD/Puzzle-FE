'use client';

import { useToast } from "@/components/ui/use-toast";


export default function ToastTest() {
  const { toast } = useToast();

  return (
    <div className="p-4">
      <button
        onClick={() => {
          toast({
            title: "토스트 테스트",
            description: "이렇게 나타나야 합니다!",
            variant: "default",
          });
        }}
      >
        토스트 보기
      </button>
    </div>
  );
}