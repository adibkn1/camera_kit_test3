import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Injectable,
  remoteApiServicesFactory,
} from '@snap/camera-kit';

(async function() {
  // Define your custom service with a modified getRequestHandler function
  const customService = {
    apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598",
    getRequestHandler: function(request) {
      // Copy "your promo code" to clipboard
      navigator.clipboard.writeText("your promo code").then(function() {
        console.log('Promo code copied to clipboard successfully!');
      }, function(err) {
        console.error('Failed to copy promo code to clipboard: ', err);
      });

      // Redirect after 1 second delay
      setTimeout(function() {
        window.location.href = 'https://www.google.co.in';
      }, 1000); // 1000 milliseconds = 1 second
    }
  };

  // Initialize Camera Kit
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

  // Request camera permission and create session
  let mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { width: 4096, height: 2160, facingMode: 'environment' }
  });

  // Function to request motion and orientation permissions
  async function requestMotionAndOrientationPermissions() {
    // Request Device Motion Permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const motionPermission = await DeviceMotionEvent.requestPermission();
        console.log(motionPermission === 'granted' ? 'Device motion permission granted' : 'Device motion permission not granted');
      } catch (error) {
        console.error('Error requesting device motion permission:', error);
      }
    }

    // Request Device Orientation Permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const orientationPermission = await DeviceOrientationEvent.requestPermission();
        console.log(orientationPermission === 'granted' ? 'Device orientation permission granted' : 'Device orientation permission not granted');
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
      }
    }
  }

  // Call the function to request motion and orientation permissions after camera permission
  await requestMotionAndOrientationPermissions();

  // Continue with your session setup
  const session = await cameraKit.createSession();
  document.getElementById('canvas').replaceWith(session.output.live);
  const { lenses } = await cameraKit.lensRepository.loadLensGroups(['f6ec2d36-229a-49c7-ba9d-847d7f287515']);
  session.applyLens(lenses[0]);

  const source = createMediaStreamSource(mediaStream, { cameraType: 'back' });
  await session.setSource(source);
  session.source.setRenderSize(window.innerWidth, window.innerHeight);
  session.play();
})();


// import {
//   bootstrapCameraKit,
//   createMediaStreamSource,
//   Transform2D,
//   Injectable,
//   remoteApiServicesFactory,
// } from '@snap/camera-kit';

// (async function() {

// // Define your custom service
// const customService = {
//   apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598",
//   getRequestHandler: function(request) {
//     window.open('https://www.google.co.in', '_blank');
//   }
// };

// // Create an async function to initialize Camera Kit and start the video stream.

//   const cameraKit = await bootstrapCameraKit({
//     apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA2NzExNzk4LCJzdWIiOiJhNWQ0ZjU2NC0yZTM0LTQyN2EtODI1Ni03OGE2NTFhODc0ZTR-U1RBR0lOR35mMzBjN2JmNy1lNjhjLTRhNzUtOWFlNC05NmJjOTNkOGIyOGYifQ.xLriKo1jpzUBAc1wfGpLVeQ44Ewqncblby-wYE1vRu0'
//   }, (container) =>
//   container.provides(
//       Injectable(
//           remoteApiServicesFactory.token,
//           [remoteApiServicesFactory.token],
//           (existing) => [...existing, customService]
//       )
//   )
// );

//     // The rest of your initialization code remains unchanged
//     const session = await cameraKit.createSession();
//     document.getElementById('canvas').replaceWith(session.output.live);
//     const { lenses } = await cameraKit.lensRepository.loadLensGroups(['f6ec2d36-229a-49c7-ba9d-847d7f287515']);
//     session.applyLens(lenses[0]);
  
//     let mediaStream = await navigator.mediaDevices.getUserMedia({
//       video: { width: 4096, height: 2160, facingMode: 'environment' }
//     });
  
//     const source = createMediaStreamSource(mediaStream, { cameraType: 'back' });
//     await session.setSource(source);
//     session.source.setRenderSize(window.innerWidth, window.innerHeight);
//     session.play();
//   })();
  