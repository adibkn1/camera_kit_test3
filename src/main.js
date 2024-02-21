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
      
      window.open('https://jahez.link/EFoKQj3nlHb', '_blank');

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

