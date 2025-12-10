import { db, appId, auth } from './firebase';
import { collection, doc, setDoc, updateDoc, arrayUnion, arrayRemove, query, onSnapshot } from 'firebase/firestore';
import { COLLECTIONS } from '../models';

const getColRef = (colName) => {
  if (!db) throw new Error("Database not initialized.");
  return collection(db, 'artifacts', appId, 'public', 'data', colName);
};

export const Services = {
  getColRef, // Exported for use in specific queries
  
  subscribeCollection: (colName, callback, modelClass, constraints = []) => {
    if (!db) return () => {};
    try {
        const q = query(getColRef(colName), ...constraints);
        return onSnapshot(q, (snap) => {
          const items = snap.docs.map(d => new modelClass({...d.data(), id: d.id}));
          items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          callback(items);
        }, (err) => console.error(`Sub error ${colName}:`, err));
    } catch (err) {
        console.error("Subscription init error:", err);
        return () => {};
    }
  },
  
  save: async (colName, item) => {
    if(!auth || !auth.currentUser) throw new Error("User belum login.");
    if (item.validate) item.validate(); 
    await setDoc(doc(getColRef(colName), item.id), item.toJSON(), { merge: true });
  },

  update: async (colName, id, data) => {
     if(!db) return;
     const docRef = doc(getColRef(colName), id);
     await updateDoc(docRef, data);
  },
  
  toggleFollow: async (currentUserId, targetUserId, isFollowing) => {
      const userRef = doc(getColRef(COLLECTIONS.USERS), currentUserId);
      const targetRef = doc(getColRef(COLLECTIONS.USERS), targetUserId);

      if (isFollowing) {
          await updateDoc(userRef, { following: arrayRemove(targetUserId) });
          await updateDoc(targetRef, { followers: arrayRemove(currentUserId) });
      } else {
          await updateDoc(userRef, { following: arrayUnion(targetUserId) });
          await updateDoc(targetRef, { followers: arrayUnion(currentUserId) });
      }
  }
};