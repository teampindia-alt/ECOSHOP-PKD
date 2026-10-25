import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("your-api-key") &&
    firebaseConfig.projectId
);

// Initialize Firebase only if configured and in browser
const app = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = app ? getAuth(app) : null;
const googleProvider = new GoogleAuthProvider();

// ==========================================
// 1. REGISTER USER (EMAIL & PASSWORD)
// ==========================================
export async function registerUser(
  email: string,
  pass: string,
  displayName: string,
  phone: string
): Promise<{ user: any; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    // Local / Demo mode fallback when Firebase keys are not added yet
    const demoUser = {
      uid: `demo-user-${Date.now()}`,
      displayName,
      email,
      phoneNumber: phone,
      photoURL: "",
    };
    return { user: demoUser };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    return { user: userCredential.user };
  } catch (err: any) {
    console.error("Firebase registration error:", err);
    return { user: null, error: mapFirebaseError(err.code || err.message) };
  }
}

// ==========================================
// 2. LOGIN USER (EMAIL & PASSWORD)
// ==========================================
export async function loginUser(
  email: string,
  pass: string
): Promise<{ user: any; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    const demoUser = {
      uid: `demo-user-${Date.now()}`,
      displayName: email.split("@")[0],
      email,
      phoneNumber: "",
      photoURL: "",
    };
    return { user: demoUser };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return { user: userCredential.user };
  } catch (err: any) {
    console.error("Firebase login error:", err);
    return { user: null, error: mapFirebaseError(err.code || err.message) };
  }
}

// ==========================================
// 3. GOOGLE SIGN IN
// ==========================================
export async function loginWithGoogle(): Promise<{ user: any; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    const demoUser = {
      uid: `google-user-${Date.now()}`,
      displayName: "ഗൂഗിൾ ഉപഭോക്താവ്",
      email: "user@gmail.com",
      phoneNumber: "",
      photoURL: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
    };
    return { user: demoUser };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (err: any) {
    console.error("Google sign-in error:", err);
    return { user: null, error: mapFirebaseError(err.code || err.message) };
  }
}

// ==========================================
// 4. LOGOUT
// ==========================================
export async function logoutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
}

// ==========================================
// 5. RESET PASSWORD
// ==========================================
export async function resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
  if (!isFirebaseConfigured || !auth) {
    return { success: true };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapFirebaseError(err.code || err.message) };
  }
}

// ==========================================
// 6. AUTH STATE LISTENER
// ==========================================
export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Helper to translate Firebase Auth errors into clear Malayalam / English messages
function mapFirebaseError(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "ഈ ഇമെയിൽ ഇതിനകം ഉപയോഗത്തിലുണ്ട്. ദയവായി ലോഗിൻ ചെയ്യുക.";
    case "auth/invalid-email":
      return "തെറ്റായ ഇമെയിൽ വിലാസം.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "ഇമെയിലോ പാസ്‌വേഡോ തെറ്റാണ്. ദയവായി പരിശോധിക്കുക.";
    case "auth/weak-password":
      return "പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം.";
    case "auth/popup-closed-by-user":
      return "ഗൂഗിൾ ലോഗിൻ വിൻഡോ ക്ലോസ് ചെയ്യപ്പെട്ടു.";
    default:
      return "ലോഗിൻ ചെയ്യുന്നതിൽ തടസ്സം നേരിട്ടു. വീണ്ടും ശ്രമിക്കുക.";
  }
}
