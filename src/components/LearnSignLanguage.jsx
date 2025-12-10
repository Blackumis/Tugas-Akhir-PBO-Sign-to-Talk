import { useState } from 'react'
import './LearnSignLanguage.css'

function LearnSignLanguage() {
  const [selectedCategory, setSelectedCategory] = useState('basics')

  const categories = [
    { id: 'basics', name: 'Basics', icon: '👋' },
    { id: 'alphabet', name: 'Alphabet', icon: '🔤' },
    { id: 'numbers', name: 'Numbers', icon: '🔢' },
    { id: 'common', name: 'Common Phrases', icon: '💬' },
    { id: 'emotions', name: 'Emotions', icon: '😊' },
  ]

  const videos = {
    basics: [
      { id: 1, title: 'Introduction to Sign Language', duration: '5:30', views: '12.5K', thumbnail: '👋', description: 'Learn the fundamentals of ASL and deaf culture' },
      { id: 2, title: 'Basic Greetings', duration: '4:15', views: '10.2K', thumbnail: '🤝', description: 'Hello, Goodbye, Nice to meet you' },
      { id: 3, title: 'Asking Questions', duration: '6:45', views: '8.9K', thumbnail: '❓', description: 'Who, What, When, Where, Why, How' },
    ],
    alphabet: [
      { id: 4, title: 'A-Z Fingerspelling', duration: '8:20', views: '15.3K', thumbnail: '🔤', description: 'Complete ASL alphabet guide' },
      { id: 5, title: 'Practice Common Names', duration: '5:50', views: '7.8K', thumbnail: '✍️', description: 'Spell names and words fluently' },
    ],
    numbers: [
      { id: 6, title: 'Numbers 0-20', duration: '4:30', views: '9.1K', thumbnail: '🔢', description: 'Basic number signs' },
      { id: 7, title: 'Numbers 20-100', duration: '6:15', views: '6.5K', thumbnail: '💯', description: 'Advanced counting' },
      { id: 8, title: 'Time and Dates', duration: '7:00', views: '5.7K', thumbnail: '⏰', description: 'Tell time in sign language' },
    ],
    common: [
      { id: 9, title: 'Family Members', duration: '5:45', views: '11.2K', thumbnail: '👨‍👩‍👧‍👦', description: 'Mother, Father, Sister, Brother, etc.' },
      { id: 10, title: 'Daily Activities', duration: '8:30', views: '9.8K', thumbnail: '🏃', description: 'Eat, Sleep, Work, Study' },
      { id: 11, title: 'Food and Drinks', duration: '6:20', views: '10.5K', thumbnail: '🍽️', description: 'Common food signs' },
    ],
    emotions: [
      { id: 12, title: 'Basic Emotions', duration: '5:15', views: '13.1K', thumbnail: '😊', description: 'Happy, Sad, Angry, Surprised' },
      { id: 13, title: 'Complex Feelings', duration: '7:40', views: '6.9K', thumbnail: '💭', description: 'Love, Hope, Worry, Pride' },
    ],
  }

  const currentVideos = videos[selectedCategory]

  return (
    <div className="learn">
      <h2 className="learn-title">Learn Sign Language</h2>
      <p className="learn-subtitle">Master ASL with our comprehensive video tutorials</p>

      <div className="category-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="category-icon">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="video-grid">
        {currentVideos.map(video => (
          <div key={video.id} className="video-card">
            <div className="video-thumbnail">
              <span className="thumbnail-icon">{video.thumbnail}</span>
              <div className="video-duration">{video.duration}</div>
              <button className="play-btn">▶️</button>
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <p className="video-description">{video.description}</p>
              <div className="video-meta">
                <span>👁️ {video.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="practice-section">
        <h3>🎯 Practice Makes Perfect</h3>
        <p>Join our daily practice sessions and connect with other learners!</p>
        <button className="practice-btn">Join Practice Session</button>
      </div>
    </div>
  )
}

export default LearnSignLanguage
