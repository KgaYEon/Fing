// 화면 주소 모음 — 주소마다 화면 컴포넌트 하나씩
import { Routes, Route, Navigate } from 'react-router-dom';
import Splash from './screens/Splash/Splash.jsx';
import Login from './screens/Login/Login.jsx';
import Onboarding from './screens/Onboarding/Onboarding.jsx';
import { STEP_ROUTES } from './screens/Onboarding/steps.js';
import Home from './screens/Home/Home.jsx';
import Report from './screens/Report/Report.jsx';
import ReportCompare from './screens/Report/ReportCompare.jsx';
import ReportDetail from './screens/Report/ReportDetail.jsx';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />}>
          <Route index element={<Navigate to="welcome" replace />} />
          {STEP_ROUTES.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
          <Route path="*" element={<Navigate to="welcome" replace />} />
        </Route>
        <Route path="/home" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report/sessions" element={<Report />} />
        <Route path="/report/compare" element={<ReportCompare />} />
        <Route path="/report/session/:id" element={<ReportDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
