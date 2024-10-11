import SendBirdCall from 'sendbird-calls';
import { AuthOption } from 'sendbird-calls';

const useSendBirdInit = async ({ userId, accessToken }: AuthOption) => {
  SendBirdCall.init(process.env.NEXT_PUBLIC_SENDBIRD_APP_ID!);
  SendBirdCall.useMedia({ audio: true, video: true });

  const authOption = { userId, accessToken };

  console.log(authOption);
  try {
    await SendBirdCall.authenticate(authOption, (result, error) => {
      if (error) {
        console.error('샌드버드 인증 실패', error);
        return;
      }
      console.log('샌드버드 인증 성공', result);
    });

    SendBirdCall.connectWebSocket()
      .then(() => {
        console.log('웹소켓 연결 성공');
      })
      .catch((error) => {
        console.error('웹소켓 연결 실패: ', error);
      });
  } catch {}
};

export { useSendBirdInit };
