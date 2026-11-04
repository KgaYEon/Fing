// 프로필 동그라미 — 피그마 "profile" (사진이 없으면 ic/my)
import Icon from '../../components/Icon.jsx';

export default function ProfileAvatar({ photo, size = 64, iconSize = 36 }) {
  return (
    <span className="my-avatar" style={{ width: size, height: size }}>
      {photo ? <img src={photo} alt="" /> : <Icon name="my" size={iconSize} />}
    </span>
  );
}
