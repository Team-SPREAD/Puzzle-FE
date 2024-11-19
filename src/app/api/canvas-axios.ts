import { toPng } from 'html-to-image';
import axiosInstance from '@/app/api/axiosInstance';

export const captureAndUpload = async (
  element: HTMLElement,
  boardId: string,
  currentStep: number,
  liveblocksToken: string | null,
) => {
  try {
    // 1. 캡처 이미지 생성
    const dataUrl = await toPng(element, { backgroundColor: '#ffffff' });

    // 2. Blob 생성
    const response = await fetch(dataUrl);
    const blob = await response.blob();

    // 3. FormData 생성
    const formData = new FormData();
    formData.append('stepImg', blob, `${boardId}-${currentStep}-capture.png`);
    console.log(formData);

    // 4. 서버로 전송
    const uploadResponse = await axiosInstance.post(
      `/api/step/${boardId}/${currentStep}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'liveblocks-token': liveblocksToken,
        },
      },
    );

    console.log('Capture uploaded:', uploadResponse.data);
  } catch (error) {
    console.error('Failed to capture and upload:', error);
  }
};
