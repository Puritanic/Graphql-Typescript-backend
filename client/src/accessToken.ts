let accessToken = '';

export const setAccessToken = (token: string) => {
  if (token) {
    accessToken = token;
  }
};

export const getAccessToken = () => accessToken;
