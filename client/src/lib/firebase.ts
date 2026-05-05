import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Use dummy config for emulator
const firebaseConfig = {
  apiKey: "dummy-api-key",
  authDomain: "demo-govbridge.firebaseapp.com",
  projectId: "demo-govbridge",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Connect to local Auth Emulator
if (typeof window !== 'undefined') {
  // To avoid reconnecting multiple times in hot reload
  if (!auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  }
}

export { app, auth };
