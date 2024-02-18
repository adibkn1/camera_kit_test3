// // Import the necessary Camera Kit modules.
// import {
//     bootstrapCameraKit,
//     createMediaStreamSource,
//     Transform2D,
//     Injectable,
//     RemoteApiService,
//     RemoteApiServices,
//     RemoteApiRequest,
//     RemoteApiRequestHandler,
//     RemoteApiStatus,
//     remoteApiServicesFactory,
//   } from '@snap/camera-kit';
  
//   // Create an async function to initialize Camera Kit and start the video stream.
//   (async function() {
//     // Bootstrap Camera Kit using your API token.
//     const cameraKit = await bootstrapCameraKit({
//       apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA2NzExNzk4LCJzdWIiOiJhNWQ0ZjU2NC0yZTM0LTQyN2EtODI1Ni03OGE2NTFhODc0ZTR-U1RBR0lOR35mMzBjN2JmNy1lNjhjLTRhNzUtOWFlNC05NmJjOTNkOGIyOGYifQ.xLriKo1jpzUBAc1wfGpLVeQ44Ewqncblby-wYE1vRu0'
//     });
  
//     // Create a new CameraKit session.
//     const session = await cameraKit.createSession(); 
  
//     // Replace the `canvas` element with the live output from the CameraKit session.
//     document.getElementById('canvas').replaceWith(session.output.live);
  
//     // Load the specified lens group.
//     const { lenses } = await cameraKit.lensRepository.loadLensGroups(['f6ec2d36-229a-49c7-ba9d-847d7f287515'])
  
//     // Apply the first lens in the lens group to the CameraKit session.
//     session.applyLens(lenses[0]);
  
//     // Get the user's media stream.
//     let mediaStream = await navigator.mediaDevices.getUserMedia({
//       video: { width: 4096, height: 2160, facingMode: 'environment' }
//     });
  
//     // Create a CameraKit media stream source from the user's media stream.
//     const source = createMediaStreamSource(
//       mediaStream, { cameraType: 'back' }
//     );
  
//     // Set the source of the CameraKit session.
//     await session.setSource(source);
  
//     // Set the render size of the CameraKit session to the size of the browser window.
//     session.source.setRenderSize( window.innerWidth,  window.innerHeight);
  
//     // Start the CameraKit session.
//     session.play();
//   })();
  


import {
  bootstrapCameraKit,
  createMediaStreamSource,
  Transform2D,
  Injectable,
  remoteApiServicesFactory,
} from '@snap/camera-kit';

(async function() {

// Define your custom service
const customService = {
  apiSpecId: "e3c8d937-6891-423a-b1ee-6c4aef8ed598",
  getRequestHandler: function(request) {
    window.open('https://www.google.co.in', '_blank');
  }
};

// Create an async function to initialize Camera Kit and start the video stream.

  const cameraKit = await bootstrapCameraKit({
    apiToken: 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzA2NzExNzk4LCJzdWIiOiJhNWQ0ZjU2NC0yZTM0LTQyN2EtODI1Ni03OGE2NTFhODc0ZTR-U1RBR0lOR35mMzBjN2JmNy1lNjhjLTRhNzUtOWFlNC05NmJjOTNkOGIyOGYifQ.xLriKo1jpzUBAc1wfGpLVeQ44Ewqncblby-wYE1vRu0'
  }, function(container) {
    container.provides(
      Injectable(
        remoteApiServicesFactory.token,
        [remoteApiServicesFactory.token],
        function(existing) {
          return [...existing, customService];
        }
      )
    );
  });

    // The rest of your initialization code remains unchanged
    const session = await cameraKit.createSession();
    document.getElementById('canvas').replaceWith(session.output.live);
    const { lenses } = await cameraKit.lensRepository.loadLensGroups(['f6ec2d36-229a-49c7-ba9d-847d7f287515']);
    session.applyLens(lenses[0]);
  
    let mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 4096, height: 2160, facingMode: 'environment' }
    });
  
    const source = createMediaStreamSource(mediaStream, { cameraType: 'back' });
    await session.setSource(source);
    session.source.setRenderSize(window.innerWidth, window.innerHeight);
    session.play();
  })();
  