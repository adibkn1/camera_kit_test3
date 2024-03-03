import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Injectable,
  remoteApiServicesFactory,
} from '@snap/camera-kit';
import { functions } from './firebaseConfig';

// Define your target location coordinates
const targetLocation = {
  latitude: 24.7531233, // Replace with your target latitude
  longitude: 46.7267408, // Replace with your target longitude
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // in metres
  return distance;
}

async function getCouponCode(userIpAddress) {
  try {
    // Check if the user's IP address has already received a coupon
    const couponRecord = await checkCouponRecord(userIpAddress);
    if (couponRecord && couponRecord.redeemed) {
      throw new Error('Coupon already redeemed for this IP address.');
    }

    // Call the Firebase Function to get a coupon code based on the user's IP
    const getCoupon = functions.httpsCallable('getCouponCode');
    const result = await getCoupon({ ip: userIpAddress });
    const couponCode = result.data.code;
    
    // Update the coupon record to mark it as redeemed
    await updateCouponRecord(userIpAddress);

    console.log(`Your coupon code: ${couponCode}`);
    return couponCode;
  } catch (error) {
    console.error('Error fetching coupon code:', error);
    throw error;
  }
}


async function initCameraKit() {
  // Define your custom service with a modified getRequestHandler function
  const customService = {
    apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598", // Replace with your actual API spec ID
    getRequestHandler: async function(request) {
      try {
        // Fetch the coupon code using the function we defined
        const promoCode = await getCouponCode();
        // Display the coupon code on the screen
        const couponDisplay = document.createElement('div');
        couponDisplay.classList.add('coupon-code');
        couponDisplay.textContent = promoCode;
        document.body.appendChild(couponDisplay);

        // Ensure the copy button is only attached once
        const button = document.createElement('button');
        button.textContent = 'Copy Code';
        button.onclick = function() {
          // Copy the promo code to clipboard
          navigator.clipboard.writeText(promoCode).then(function() {
            console.log('Copying to clipboard was successful!');
            // Redirect if necessary or update the UI to show the promo code
            window.location.href = "https://jahez.link/EFoKQj3nlHb";
          }, function(err) {
            console.error('Could not copy text:', err);
          });
        };
        document.body.appendChild(button);
      } catch (error) {
        // Handle errors from fetching the coupon code
        alert("Sorry, we couldn't fetch a promo code for you.");
      }
    }
  };

  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA2NzExNzk4LCJzdWIiOiJhNWQ0ZjU2NC0yZTM0LTQyN2EtODI1Ni03OGE2NTFhODc0ZTR-U1RBR0lOR35mMzBjN2JmNy1lNjhjLTRhNzUtOWFlNC05NmJjOTNkOGIyOGYifQ.xLriKo1jpzUBAc1wfGpLVeQ44Ewqncblby-wYE1vRu0' // Replace with your actual API token
  }, (container) =>
    container.provides(
      Injectable(
        remoteApiServicesFactory.token,
        [remoteApiServicesFactory.token],
        (existing) => [...existing, customService]
      )
    )
  );

  let mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { width: 4096, height: 2160, facingMode: 'environment' }
  });

  const session = await cameraKit.createSession();
  document.getElementById('canvas').replaceWith(session.output.live);
  const { lenses } = await cameraKit.lensRepository.loadLensGroups(['f6ec2d36-229a-49c7-ba9d-847d7f287515']); // Replace with your actual lens group ID
  session.applyLens(lenses[0]);

  const source = createMediaStreamSource(mediaStream, { cameraType: 'back' });
  await session.setSource(source);
  session.source.setRenderSize(window.innerWidth, window.innerHeight);
  session.play();
}

function checkLocationAndInit() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const distance = calculateDistance(
        position.coords.latitude,
        position.coords.longitude,
        targetLocation.latitude,
        targetLocation.longitude
      );

      if (distance <= 200000000000000000000000) {
        initCameraKit();
      } else {
        alert("Sorry, you're outside the Leap Project.");
      }
    }, function(error) {
      alert(`ERROR(${error.code}): ${error.message}`);
    }, {
      maximumAge: 60000,
      timeout: 5000,
      enableHighAccuracy: true
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Call this function on page load or after a user interaction
checkLocationAndInit();
