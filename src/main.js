
import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Injectable,
  remoteApiServicesFactory,
} from '@snap/camera-kit';

// Define your target location coordinates
const targetLocation = {
  latitude: 28.451266409859592,  // Replace with your target latitude
  longitude: 77.09719998169876, // Replace with your target longitude
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

function fetchRandomCoupon() {
  return new Promise((resolve, reject) => {
    const couponsRef = firebase.database().ref('coupons');
    couponsRef.once('value', snapshot => {
      const coupons = snapshot.val();
      const couponKeys = Object.keys(coupons).filter(key => !coupons[key].redeemed);
      if (couponKeys.length === 0) {
        reject('No available coupons');
        return;
      }
      const randomIndex = Math.floor(Math.random() * couponKeys.length);
      const randomCouponKey = couponKeys[randomIndex];
      const randomCoupon = coupons[randomCouponKey];
      
      // Mark the coupon as redeemed
      couponsRef.child(randomCouponKey).update({redeemed: true}).then(() => {
        resolve(randomCoupon.code);
      }).catch(reject);
    }).catch(reject);
  });
}

function initCameraKit() {
  (async function() {
    const customService = {
      apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598",
      getRequestHandler: async function(request) {
        var button = document.getElementById('copyButton');
        button.style.display = 'block';

        button.onclick = async function() {
          try {
            window.location.href = "https://jahez.link/EFoKQj3nlHb";
            const couponCode = await fetchRandomCoupon();
            navigator.clipboard.writeText(couponCode).then(function() {
              console.log('Copying to clipboard was successful!');
              //window.location.href = "https://jahez.link/EFoKQj3nlHb";
            }, function(err) {
              console.error('Could not copy text:', err);
            });
          } catch (error) {
            console.error('Error fetching coupon:', error);
            alert('Failed to fetch coupon. Please try again.');
          }
        };
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
  })();
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

      if (distance <= 2000) { // Check if within 2 km
        initCameraKit();
      } else {
        alert("Join us at LEAP! This game is only available inside the LEAP venue.");
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