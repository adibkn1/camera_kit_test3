// Import the Firebase modules that you need in your app.
import firebase from "firebase/app";
import "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlnPWxGnDvy6fRs49gHxOyKUNOyYgxNUE",
    authDomain: "jahez-coupon.firebaseapp.com",
    projectId: "jahez-coupon",
    storageBucket: "jahez-coupon.appspot.com",
    messagingSenderId: "40997728682",
    appId: "1:40997728682:web:8a62070633298c06d0fbd3"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Function to fetch and redeem a coupon
async function fetchAndRedeemCoupon() {
  const couponsRef = db.collection('coupons');
  const snapshot = await couponsRef.where('redeemed', '==', false).get();

  if (snapshot.empty) {
    console.log('No unredeemed coupons found.');
    return null;
  }

  const unredeemedCoupons = [];
  snapshot.forEach(doc => {
    unredeemedCoupons.push({ id: doc.id, ...doc.data() });
  });

  // Select a random coupon
  const randomCoupon = unredeemedCoupons[Math.floor(Math.random() * unredeemedCoupons.length)];

  // Mark as redeemed
  await couponsRef.doc(randomCoupon.id).update({
    redeemed: true
  });

  return randomCoupon.code;
}

// Export the function to use in other files
export { fetchAndRedeemCoupon };
