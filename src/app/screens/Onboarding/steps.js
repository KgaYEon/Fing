// 주소 ↔ 단계 화면 컴포넌트
import Welcome from './steps/Welcome.jsx';
import Permission from './steps/Permission.jsx';
import Nickname from './steps/Nickname.jsx';
import Intro from './steps/Intro.jsx';
import { Q1, Q2, Q3 } from './steps/Question.jsx';
import Done from './steps/Done.jsx';

export const STEP_ROUTES = [
  { path: 'welcome', Component: Welcome },
  { path: 'permission', Component: Permission },
  { path: 'nickname', Component: Nickname },
  { path: 'intro', Component: Intro },
  { path: 'q1', Component: Q1 },
  { path: 'q2', Component: Q2 },
  { path: 'q3', Component: Q3 },
  { path: 'done', Component: Done },
];
