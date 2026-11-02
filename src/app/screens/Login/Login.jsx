// 로그인 — 피그마 onboarding / splash (185:1817)
// 소셜 버튼: 0.8초 로딩 → 처음 온 사람은 온보딩, 다시 온 사람은 홈 (진짜 로그인 연결은 나중 단계)
// 약관 링크: 아래에서 올라오는 시트
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wordmark } from '../../components/Logo.jsx';
import SocialButton from '../../components/SocialButton.jsx';
import useThemeColor from '../../components/useThemeColor.js';
import { wait } from '../../../ui/ui.js';
import { ROUTES, isOnboarded } from '../../routes.js';
import LegalLinks from './LegalLinks.jsx';
import LegalSheet from './LegalSheet.jsx';
import './login.css';

const PROVIDERS = ['google', 'kakao', 'apple'];

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [doc, setDoc] = useState(null);
  useThemeColor('#F5F8FB');

  const signIn = async (kind) => {
    setLoading(kind);
    await wait(800); // 로그인하는 척
    navigate(isOnboarded() ? ROUTES.home.path : ROUTES.onboarding.path);
  };

  return (
    <main className="screen login" aria-labelledby="login-tagline">
      <div className="login__brand">
        <p className="login__tagline" id="login-tagline">성장하는 서퍼의 기록</p>
        <h1 className="login__wordmark"><Wordmark /></h1>
      </div>
      <div className="login__actions">
        <div className="login__buttons">
          {PROVIDERS.map((k) => (
            <SocialButton key={k} kind={k} busy={loading === k} locked={loading && loading !== k} onClick={signIn} />
          ))}
        </div>
        <LegalLinks onOpen={setDoc} />
      </div>
      <LegalSheet doc={doc} onClose={() => setDoc(null)} />
    </main>
  );
}
