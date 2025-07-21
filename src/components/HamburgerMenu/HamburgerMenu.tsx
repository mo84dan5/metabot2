import { useStore } from '../../store/useStore';
import './HamburgerMenu.css';

const HamburgerMenu = () => {
  const { isMenuOpen, toggleMenu, setCurrentView } = useStore();

  const menuItems = [
    { id: 'chat', label: 'チャット', icon: '💬' },
    { id: 'log', label: '会話ログ', icon: '📝' },
    { id: 'tasks', label: 'タスク', icon: '✅' },
    { id: 'settings', label: '設定', icon: '⚙️' },
  ] as const;

  return (
    <>
      <button 
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label="メニューを開く"
      >
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
      </button>

      <div className={`menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu} />
      
      <nav className={`menu-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <h2 className="menu-title">メニュー</h2>
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className="menu-item"
                onClick={() => setCurrentView(item.id)}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default HamburgerMenu;