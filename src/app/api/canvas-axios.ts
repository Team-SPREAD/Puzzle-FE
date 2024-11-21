import { toPng } from 'html-to-image';
import axiosInstance from '@/app/api/axiosInstance';

//Canvas 이미지화 및 서버로 업로드
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

// 단계 결과 조회
export const stepResult = async (
  boardId: string,
  liveblocksToken: string | null,
): Promise<{ data: { boardId: string; result: string } } | null> => {
  try {
    const resultResponse = await axiosInstance.get(
      `/api/step/${boardId}/result`,
      {
        headers: {
          'liveblocks-token': liveblocksToken,
        },
      },
    );

    // 성공적으로 데이터 반환
    if (resultResponse.status === 200) {
      console.log('Result retrieved successfully:', resultResponse.data);
      return resultResponse;
    } else {
      console.warn('Unexpected status code:', resultResponse.status);
      return null;
    }
  } catch (error: any) {
    // 에러 핸들링
    if (error.response) {
      const status = error.response.status;

      // 상태 코드별로 분기 처리
      switch (status) {
        case 401: // 인증 실패
          console.error('Unauthorized: Invalid Liveblocks token.');
          break;
        case 404: // 리소스 찾을 수 없음
          console.error(`Board not found: ${boardId}`);
          break;
        case 500: // 서버 오류
          console.error('Internal Server Error. Please try again later.');
          break;
        default:
          console.error(
            `Unhandled error with status ${status}:`,
            error.response.data,
          );
      }
    } else {
      // 네트워크 또는 기타 오류
      console.error('Network or other error:', error.message);
    }
    return null;
  }
};
