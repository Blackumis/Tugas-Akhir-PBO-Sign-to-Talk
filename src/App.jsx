import { useState, lazy, Suspense } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'

const Feed = lazy(() => import('./components/Feed'))
const Chat = lazy(() => import('./components/Chat'))
const LearnSignLanguage = lazy(() => import('./components/LearnSignLanguage'))
const Profile = lazy(() => import('./components/Profile'))
const FriendList = lazy(() => import('./components/FriendList'))

function App() {
  const [activeTab, setActiveTab] = useState('feed')

  return (
    <div className="app">
      <header className="app-header">
        <img src="/image/Sign to talk.png" alt="Sign To Talk" className="app-logo" />
        <p>Connecting the Deaf Community</p>
      </header>
      
      <div className="app-container">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="main-content">
          <Suspense fallback={<div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>}>
            {activeTab === 'feed' && <Feed />}
            {activeTab === 'chat' && <Chat />}
            {activeTab === 'learn' && <LearnSignLanguage />}
            {activeTab === 'friends' && <FriendList />}
            {activeTab === 'profile' && <Profile />}
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default App
