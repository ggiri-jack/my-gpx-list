import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD4bASekELMhcn8do4e20Gd3N418LnmhA0",
    authDomain: "my-gpx-list.firebaseapp.com",
    projectId: "my-gpx-list",
    storageBucket: "my-gpx-list.appspot.com",
    messagingSenderId: "819732096732",
    appId: "1:819732096732:web:d8028a2bacaf00563df619"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  export { firestore, storage };
