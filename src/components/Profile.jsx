import { useState } from 'react'
import './Profile.css'

function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Alex Rivera',
    username: '@alexrivera',
    bio: 'Deaf advocate, sign language teacher, and proud member of the deaf community 🤟',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    followers: 324,
    following: 189,
    posts: 42
  })

  const [stats] = useState([
    { label: 'Posts', value: 42, icon: '📝' },
    { label: 'Followers', value: 324, icon: '👥' },
    { label: 'Following', value: 189, icon: '➕' },
    { label: 'Likes', value: 856, icon: '❤️' }
  ])

  const [userPosts] = useState([
    { id: 1, content: 'Just learned a new sign for "coffee" today! ☕', likes: 24, comments: 5, time: '2 days ago' },
    { id: 2, content: 'Excited to announce our local deaf community meetup this Saturday! 🤟', likes: 42, comments: 12, time: '5 days ago' },
    { id: 3, content: 'Teaching my hearing friends sign language. They love it! 💚', likes: 68, comments: 15, time: '1 week ago' }
  ])

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-cover"></div>
        <div className="profile-info-container">
          <div className="profile-avatar-large">😊</div>
          <div className="profile-main-info">
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-username">{profile.username}</p>
          </div>
          <button className="edit-profile-btn" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-details">
            <h3>About</h3>
            {isEditing ? (
              <textarea 
                className="edit-bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                rows="4"
              />
            ) : (
              <p className="profile-bio">{profile.bio}</p>
            )}
            
            <div className="profile-meta">
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{profile.location}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span>Joined {profile.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="profile-stats-card">
            <h3>Statistics</h3>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-icon">{stat.icon}</span>
                  <div className="stat-info">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-tabs">
            <button className="profile-tab active">My Posts</button>
            <button className="profile-tab">Media</button>
            <button className="profile-tab">Likes</button>
          </div>

          <div className="user-posts">
            {userPosts.map(post => (
              <div key={post.id} className="user-post">
                <div className="user-post-header">
                  <div className="post-avatar-small">😊</div>
                  <div>
                    <h4>{profile.name}</h4>
                    <span className="post-time">{post.time}</span>
                  </div>
                </div>
                <p className="user-post-content">{post.content}</p>
                <div className="user-post-actions">
                  <span>❤️ {post.likes}</span>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
