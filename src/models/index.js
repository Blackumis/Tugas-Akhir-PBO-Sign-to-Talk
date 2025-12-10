export class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = "ValidationError";
    }
  }
  
  export const COLLECTIONS = {
    USERS: 'users',
    POSTS: 'posts',
    COMMENTS: 'comments',
    MESSAGES: 'messages',
    VIDEOS: 'videos'
  };
  
  export class BaseModel {
    constructor(id = null) {
      this.id = id || Date.now() + Math.random().toString(36).substr(2, 9);
      this.createdAt = new Date().toISOString();
    }
    validate() { return true; }
    toJSON() { return { ...this }; }
  }
  
  export class User extends BaseModel {
    constructor(data = {}) {
      super(data.id);
      this.name = data.name || 'Anonymous';
      this.username = data.username || '@anon';
      this.email = data.email || '';
      this.avatar = data.avatar || 'https://ui-avatars.com/api/?name=' + (this.name || 'User') + '&background=random';
      this.bio = data.bio || '';
      this.isOnline = data.isOnline || false;
      this.userType = data.userType || 'User'; 
      this.following = data.following || [];
      this.followers = data.followers || [];
      if(data.createdAt) this.createdAt = data.createdAt;
    }
  }
  
  export class Post extends BaseModel {
    constructor(data = {}) {
      super(data.id);
      this.authorId = data.authorId;
      this.author = data.author; 
      this.content = data.content || '';
      this.likes = data.likes || 0;
      this.commentsCount = data.commentsCount || 0;
      if(data.createdAt) this.createdAt = data.createdAt;
    }
    validate() {
      if (!this.content) throw new ValidationError("Konten tidak boleh kosong.");
      return true;
    }
  }
  
  export class Comment extends BaseModel {
    constructor(data = {}) {
      super(data.id);
      this.postId = data.postId;
      this.authorId = data.authorId;
      this.authorName = data.authorName;
      this.authorAvatar = data.authorAvatar;
      this.text = data.text || '';
      if(data.createdAt) this.createdAt = data.createdAt;
    }
  }
  
  export class Message extends BaseModel {
    constructor(data = {}) {
      super(data.id);
      this.senderId = data.senderId;
      this.receiverId = data.receiverId;
      this.text = data.text || '';
      if(data.createdAt) this.createdAt = data.createdAt;
    }
    validate() {
      if (!this.text) throw new ValidationError("Pesan tidak boleh kosong.");
      return true;
    }
  }
  
  export class Video extends BaseModel {
    constructor(data = {}) {
      super(data.id);
      this.title = data.title || '';
      this.youtubeId = data.youtubeId || ''; 
      this.level = data.level || 'Beginner';
      this.views = data.views || 0;
    }
    getThumbnailUrl() { return `https://img.youtube.com/vi/${this.youtubeId}/hqdefault.jpg`; }
    getEmbedUrl() { return `https://www.youtube.com/embed/${this.youtubeId}?autoplay=1`; }
  }