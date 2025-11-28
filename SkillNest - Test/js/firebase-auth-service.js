// ==========================================
// FIREBASE AUTHENTICATION SERVICE
// ==========================================

import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  doc,
  getDoc,
  createUserWithEmailAndPassword, 
  setDoc 
} from './firebase-config.js';

// ==========================================
// GET CURRENT USER
// ==========================================
export async function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      if (user) {
        try {
          console.log('User found in Firebase Auth:', user.uid);
          // ดึงข้อมูลโปรไฟล์จาก Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data from Firestore:', userData);
            resolve({
              uid: user.uid,
              email: user.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              age: userData.age,
              gender: userData.gender,
              dob: userData.dob
            });
          } else {
            console.log('User doc not found in Firestore');
            resolve({
              uid: user.uid,
              email: user.email,
              firstName: 'User',
              lastName: 'Name'
            });
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          resolve(null);
        }
      } else {
        console.log('No user logged in');
        resolve(null);
      }
    });
  });
}

// ==========================================
// LOGIN USER
// ==========================================
export async function loginUser(email, password) {
  try {
    console.log('Attempting to login with:', email);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Login successful! User ID:', user.uid);
    
    // ดึงข้อมูลโปรไฟล์
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User profile loaded:', userData);
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        }
      };
    } else {
      console.log('User profile not found in Firestore');
      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          firstName: 'User',
          lastName: 'Name'
        }
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
}

// ==========================================
// LOGOUT USER
// ==========================================
export async function logoutUser() {
  try {
    await signOut(auth);
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: error.code,
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ'
    };
  }
}

// ==========================================
// CHECK AUTH STATE
// ==========================================
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        console.log('Auth state changed - User logged in:', user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          callback({
            uid: user.uid,
            email: user.email,
            firstName: userData.firstName,
            lastName: userData.lastName
          });
        } else {
          callback({
            uid: user.uid,
            email: user.email,
            firstName: 'User',
            lastName: 'Name'
          });
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    } else {
      console.log('Auth state changed - No user');
      callback(null);
    }
  });
}

// ==========================================
// ERROR MESSAGE HELPER
// ==========================================
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/user-not-found': 'ไม่พบผู้ใช้นี้ในระบบ',
    'auth/wrong-password': 'รหัสผ่านไม่ถูกต้อง',
    'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว',
    'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'auth/network-request-failed': 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย',
    'auth/too-many-requests': 'มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่'
  };
  
  return errorMessages[errorCode] || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
}

// ==========================================
// SAVE USER PROFILE (NEW FUNCTION)
// ==========================================
/**
 * บันทึกข้อมูลโปรไฟล์เพิ่มเติมของผู้ใช้ลงใน Firestore
 */
export async function saveUserProfile(userId, profileData) {
  try {
    console.log('Attempting to save profile for:', userId);
    // อ้างอิงถึงเอกสารใน collection 'users' โดยใช้ userId เป็น Document ID
    const userDocRef = doc(db, "users", userId); 

    // ใช้ setDoc เพื่อสร้าง/อัพเดตเอกสารใน Firestore
    await setDoc(userDocRef, profileData);

    console.log("Profile successfully saved to Firestore!");
    return { success: true };
  } catch (error) {
    console.error("Error saving user profile to Firestore:", error);
    // ส่ง error ออกไปเพื่อให้ signup.html จัดการ
    return { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลโปรไฟล์' };
  }
}

// ==========================================
// SIGNUP USER (NEW FUNCTION)
// ==========================================
export async function signupUser(email, password) {
  try {
    console.log('Attempting to sign up with:', email);
    // ใช้ createUserWithEmailAndPassword เพื่อสร้างบัญชีใหม่
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('Sign up successful! User ID:', user.uid);

    return {
      success: true,
      user: user
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
}