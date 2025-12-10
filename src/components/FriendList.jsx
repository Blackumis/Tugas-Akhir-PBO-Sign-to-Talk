import { useState } from 'react'
import './FriendList.css'

function FriendList() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const [friends] = useState([
    { id: 1, name: 'Sarah Johnson', username: '@sarah_signs', avatar: '👩', status: 'online', mutualFriends: 12, bio: 'ASL teacher & advocate' },
    { id: 2, name: 'Mike Chen', username: '@mikechen', avatar: '👨', status: 'online', mutualFriends: 8, bio: 'Deaf community organizer' },
    { id: 3, name: 'Emma Williams', username: '@emmawill', avatar: '👩‍🦰', status: 'offline', mutualFriends: 15, bio: 'Sign language enthusiast' },
    { id: 4, name: 'Alex Rivera', username: '@alexrivera', avatar: '😊', status: 'online', mutualFriends: 20, bio: 'Deaf advocate & blogger' },
    { id: 5, name: 'Jordan Lee', username: '@jordanlee', avatar: '👤', status: 'offline', mutualFriends: 5, bio: 'ASL student' },
    { id: 6, name: 'Taylor Kim', username: '@taylorkim', avatar: '🙂', status: 'online', mutualFriends: 18, bio: 'Interpreter & educator' },
  ])

  const [friendRequests] = useState([
    { id: 1, name: 'Chris Martinez', username: '@chrismartinez', avatar: '👨‍💼', mutualFriends: 7, bio: 'New to sign language' },
    { id: 2, name: 'Sam Thompson', username: '@samthompson', avatar: '👩‍💻', mutualFriends: 3, bio: 'Developer learning ASL' },
    { id: 3, name: 'Jamie Davis', username: '@jamiedavis', avatar: '😃', mutualFriends: 10, bio: 'Deaf community supporter' },
  ])

  const [suggestions] = useState([
    { id: 1, name: 'Riley Cooper', username: '@rileycooper', avatar: '👨‍🎓', mutualFriends: 14, bio: 'Sign language researcher' },
    { id: 2, name: 'Morgan Blake', username: '@morganblake', avatar: '👩‍🏫', mutualFriends: 9, bio: 'Deaf education specialist' },
    { id: 3, name: 'Casey Stone', username: '@caseystone', avatar: '🙋', mutualFriends: 6, bio: 'ASL content creator' },
  ])

  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="friend-list">
      <div className="friend-list-header">
        <h2 className="friend-list-title">Friends</h2>
        <p className="friend-list-subtitle">Connect with the deaf community</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="friend-tabs">
        <button 
          className={`friend-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Friends <span className="tab-count">{friends.length}</span>
        </button>
        <button 
          className={`friend-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests <span className="tab-count">{friendRequests.length}</span>
        </button>
        <button 
          className={`friend-tab ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions <span className="tab-count">{suggestions.length}</span>
        </button>
      </div>

      <div className="friend-content">
        {activeTab === 'all' && (
          <div className="friend-grid">
            {filteredFriends.map(friend => (
              <div key={friend.id} className="friend-card">
                <div className="friend-card-header">
                  <div className="friend-avatar-container">
                    <div className="friend-avatar">{friend.avatar}</div>
                    {friend.status === 'online' && <span className="status-dot online"></span>}
                  </div>
                  <button className="friend-menu-btn">⋮</button>
                </div>
                
                <div className="friend-info">
                  <h3 className="friend-name">{friend.name}</h3>
                  <p className="friend-username">{friend.username}</p>
                  <p className="friend-bio">{friend.bio}</p>
                  <p className="mutual-friends">👥 {friend.mutualFriends} mutual friends</p>
                </div>

                <div className="friend-actions">
                  <button className="friend-action-btn primary">💬 Message</button>
                  <button className="friend-action-btn">👤 View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="friend-grid">
            {friendRequests.map(request => (
              <div key={request.id} className="friend-card request">
                <div className="friend-card-header">
                  <div className="friend-avatar-container">
                    <div className="friend-avatar">{request.avatar}</div>
                  </div>
                </div>
                
                <div className="friend-info">
                  <h3 className="friend-name">{request.name}</h3>
                  <p className="friend-username">{request.username}</p>
                  <p className="friend-bio">{request.bio}</p>
                  <p className="mutual-friends">👥 {request.mutualFriends} mutual friends</p>
                </div>

                <div className="friend-actions">
                  <button className="friend-action-btn accept">✓ Accept</button>
                  <button className="friend-action-btn decline">✕ Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="friend-grid">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="friend-card suggestion">
                <div className="friend-card-header">
                  <div className="friend-avatar-container">
                    <div className="friend-avatar">{suggestion.avatar}</div>
                  </div>
                  <button className="friend-menu-btn">⋮</button>
                </div>
                
                <div className="friend-info">
                  <h3 className="friend-name">{suggestion.name}</h3>
                  <p className="friend-username">{suggestion.username}</p>
                  <p className="friend-bio">{suggestion.bio}</p>
                  <p className="mutual-friends">👥 {suggestion.mutualFriends} mutual friends</p>
                </div>

                <div className="friend-actions">
                  <button className="friend-action-btn primary">➕ Add Friend</button>
                  <button className="friend-action-btn">👤 View Profile</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendList
