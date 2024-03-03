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
    let preFetchedCouponCode = null; // Variable to store the pre-fetched coupon code

    const customService = {
      apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598",
      getRequestHandler: async function(request) {
        // Pre-fetch the coupon code as soon as this function is triggered
        preFetchedCouponCode = await fetchAndRedeemCoupon();

        // Set up the button visibility and click event listener
        var button = document.getElementById('copyButton');
        if (!button) {
          console.error('Button #copyButton not found in the DOM.');
          return;
        }
        button.style.display = 'block';

        button.addEventListener('click', async () => {
          // Check if we have a pre-fetched coupon code
          if (preFetchedCouponCode) {
            try {
              await navigator.clipboard.writeText(preFetchedCouponCode);
              console.log('Copying to clipboard was successful!');
              window.location.href = "https://jahez.link/EFoKQj3nlHb";
            } catch (err) {
              console.error('Failed to copy to clipboard:', err);
            }
          } else {
            console.log('No coupon code was fetched.');
          }
        });
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
