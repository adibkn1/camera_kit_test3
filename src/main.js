import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Injectable,
  remoteApiServicesFactory,
} from '@snap/camera-kit';

// Import the fetchAndRedeemCoupon function from your Firebase configuration file
import { fetchAndRedeemCoupon } from './firebaseConfig.js'; // Adjust the path as necessary

function initCameraKit() {
  (async function() {
    const customService = {
      apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598",
      getRequestHandler: async function(request) { // Make sure this is marked as async
        var button = document.getElementById('copyButton');
        button.style.display = 'block';

        button.onclick = async function() { // This function also needs to be async
          // Fetch a random unredeemed coupon code
          const couponCode = await fetchAndRedeemCoupon();
          if (couponCode) {
            navigator.clipboard.writeText(couponCode).then(function() {
              console.log('Copying to clipboard was successful!');
              window.location.href = "https://jahez.link/EFoKQj3nlHb";
            }, function(err) {
              console.error('Could not copy text:', err);
            });
          } else {
            console.log('No unredeemed coupons available.');
          }
        };
      }
    };

    const cameraKit = await bootstrapCameraKit({
      apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA2NzExNzk4LCJzdWIiOiJhNWQ0ZjU2NC0yZTM0LTQyN2EtODI1Ni03OGE2NTFhODc0ZTR-U1RBR0lOR35mMzBjN2JmNy1lNjhjLTRhNzUtOWFlNC05NmJjOTNkOGIyOGYifQ.xLriKo1jpzUBAc1wfGpLVeQ44Ewqncblby-wYE1vRu0'
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
    const { lenses } = await cameraKit.lensRepository.loadLensGroups(['f6ec2d36-229a-49c7-ba9d-847d7f287515']);
    session.applyLens(lenses[0]);

    const source = createMediaStreamSource(mediaStream, { cameraType: 'back' });
    await session.setSource(source);
    session.source.setRenderSize(window.innerWidth, window.innerHeight);
    session.play();
  })();
}

// Call this function on page load or after a user interaction
initCameraKit();
