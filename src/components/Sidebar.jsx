import './Sidebar.css'

function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'feed', icon: '◫', label: 'Feed' },
    { id: 'chat', icon: '◉', label: 'Chat' },
    { id: 'learn', icon: '◐', label: 'Learn' },
    { id: 'friends', icon: '◎', label: 'Friends' },
    { id: 'profile', icon: '◉', label: 'Profile' }
  ]

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
