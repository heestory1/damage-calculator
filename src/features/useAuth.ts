import { useState, useEffect } from 'react';

// const TOKEN_KEY = 'premium_token_v2';
// const AUTH_API = 'https://torifun-auth.yhs7894-c0c.workers.dev/verify';

export function useAuth() {
  // 인증 단계를 주석 처리하고 항상 true를 반환하여 모든 기능을 개방합니다.
  const [isPremium, setIsPremium] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsPremium(true);
    setLoading(false);
  }, []);

  const verify = async (code: string) => {
    // 임시로 무조건 성공 반환
    console.log("Auth verification requested with code:", code);
    return true;
  };

  const logout = () => {
    // setIsPremium(false);
  };

  return { isPremium, verify, logout, loading };
}