import { useState } from 'react'
import './Feed.css'

function Feed() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: '👩',
      time: '2 hours ago',
      content: 'Just learned a new sign for "coffee" today! ☕ The sign language community is amazing!',
      likes: 24,
      comments: 5,
      image: null
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: '👨',
      time: '5 hours ago',
      content: 'Excited to announce our local deaf community meetup this Saturday at Central Park! 🤟',
      likes: 42,
      comments: 12,
      image: null
    },
    {
      id: 3,
      author: 'Emma Williams',
      avatar: '👩‍🦰',
      time: '1 day ago',
      content: 'Teaching my hearing friends sign language. They love it! Communication is for everyone 💚',
      likes: 68,
      comments: 15,
      image: null
    }
  ])

  const [newPost, setNewPost] = useState('')

  const handleCreatePost = (e) => {
    e.preventDefault()
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: 'You',
        avatar: '😊',
        time: 'Just now',
        content: newPost,
        likes: 0,
        comments: 0,
        image: null
      }
      setPosts([post, ...posts])
      setNewPost('')
    }
  }

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ))
  }

  return (
    <div className="feed">
      <h2 className="feed-title">Community Feed</h2>
      
      <form className="create-post" onSubmit={handleCreatePost}>
        <div className="create-post-avatar">😊</div>
        <textarea
          className="create-post-input"
          placeholder="Share your thoughts with the community..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          rows="3"
        />
        <button type="submit" className="create-post-btn">Post</button>
      </form>

      <div className="posts">
        {posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-header">
              <div className="post-avatar">{post.avatar}</div>
              <div className="post-info">
                <h3 className="post-author">{post.author}</h3>
                <span className="post-time">{post.time}</span>
              </div>
            </div>
            
            <div className="post-content">
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" className="post-image" />}
            </div>
            
            <div className="post-actions">
              <button 
                className="post-action-btn"
                onClick={() => handleLike(post.id)}
              >
                ❤️ {post.likes} Likes
              </button>
              <button className="post-action-btn">
                💬 {post.comments} Comments
              </button>
              <button className="post-action-btn">
                🔗 Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Feed
