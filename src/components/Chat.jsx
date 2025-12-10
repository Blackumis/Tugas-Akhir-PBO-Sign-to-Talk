import { useState } from 'react'
import './Chat.css'

function Chat() {
  const [conversations] = useState([
    { id: 1, name: 'Sarah Johnson', avatar: '👩', lastMessage: 'See you at the meetup!', unread: 2, online: true },
    { id: 2, name: 'Mike Chen', avatar: '👨', lastMessage: 'Thanks for teaching me that sign!', unread: 0, online: true },
    { id: 3, name: 'Emma Williams', avatar: '👩‍🦰', lastMessage: 'The video tutorial was great', unread: 1, online: false },
    { id: 4, name: 'Deaf Community Group', avatar: '👥', lastMessage: 'New event posted', unread: 5, online: true },
  ])

  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [isVideoCall, setIsVideoCall] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sarah Johnson', text: 'Hey! How are you?', time: '10:30 AM', mine: false },
    { id: 2, sender: 'You', text: 'Great! Just finished learning a new sign', time: '10:32 AM', mine: true },
    { id: 3, sender: 'Sarah Johnson', text: 'That\'s awesome! Which one?', time: '10:33 AM', mine: false },
    { id: 4, sender: 'You', text: 'The sign for "friend" 🤝', time: '10:35 AM', mine: true },
    { id: 5, sender: 'Sarah Johnson', text: 'See you at the meetup!', time: '10:36 AM', mine: false },
  ])

  const [newMessage, setNewMessage] = useState('')

  const startVideoCall = () => {
    setIsVideoCall(true)
    setCallDuration(0)
    setIsVideoOn(true)
    setIsMuted(false)
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
    // Store interval ID to clear it later
    window.callInterval = interval
  }

  const endVideoCall = () => {
    setIsVideoCall(false)
    if (window.callInterval) {
      clearInterval(window.callInterval)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: true
      }
      setMessages([...messages, message])
      setNewMessage('')
    }
  }

  return (
    <>
      {isVideoCall && (
        <div className="video-call-overlay">
          <div className="video-call-container">
            <div className="video-call-header">
              <div className="call-info">
                <h3>{selectedChat.name}</h3>
                <span className="call-duration">{formatDuration(callDuration)}</span>
              </div>
              <button className="minimize-btn" onClick={endVideoCall}>✕</button>
            </div>

            <div className="video-screens">
              <div className="main-video">
                <div className="video-placeholder">
                  <div className="avatar-large">{selectedChat.avatar}</div>
                  <p className="video-label">{selectedChat.name}</p>
                </div>
              </div>
              <div className="self-video">
                <div className="video-placeholder-small">
                  {isVideoOn ? (
                    <>
                      <div className="avatar-small">🙋</div>
                      <p className="video-label-small">You</p>
                    </>
                  ) : (
                    <>
                      <div className="video-off-icon">📹</div>
                      <p className="video-label-small">Video Off</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="video-call-controls">
              <button className={`control-btn mute-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute}>
                <span className="control-icon">{isMuted ? '🔇' : '🎤'}</span>
                <span className="control-label">{isMuted ? 'Unmute' : 'Mute'}</span>
              </button>
              <button className={`control-btn video-toggle-btn ${!isVideoOn ? 'active' : ''}`} onClick={toggleVideo}>
                <span className="control-icon">{isVideoOn ? '📹' : '🚫'}</span>
                <span className="control-label">{isVideoOn ? 'Video On' : 'Video Off'}</span>
              </button>
              <button className="control-btn captions-btn">
                <span className="control-icon">💬</span>
                <span className="control-label">Captions</span>
              </button>
              <button className="control-btn sign-btn">
                <span className="control-icon">🤟</span>
                <span className="control-label">Sign Mode</span>
              </button>
              <button className="control-btn end-call-btn" onClick={endVideoCall}>
                <span className="control-icon">📞</span>
                <span className="control-label">End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="chat">
        <div className="chat-sidebar">
          <h2 className="chat-title">Messages</h2>
          <div className="conversations">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`conversation ${selectedChat.id === conv.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(conv)}
              >
                <div className="conversation-avatar">
                  {conv.avatar}
                  {conv.online && <span className="online-indicator"></span>}
                </div>
                <div className="conversation-info">
                  <h3 className="conversation-name">{conv.name}</h3>
                  <p className="conversation-last-message">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="unread-badge">{conv.unread}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-header-avatar">{selectedChat.avatar}</div>
            <div className="chat-header-info">
              <h3>{selectedChat.name}</h3>
              <span className={`status ${selectedChat.online ? 'online' : 'offline'}`}>
                {selectedChat.online ? 'Online' : 'Offline'}
              </span>
            </div>
            <button className="video-call-btn" onClick={startVideoCall}>📹 Video Call</button>
          </div>

          <div className="messages">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.mine ? 'mine' : ''}`}>
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form className="message-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="message-input"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Chat
