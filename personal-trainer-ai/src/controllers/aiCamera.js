import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

let pose;
let camera;

async function initCamera() {
  // Initialize the MediaPipe Pose model
  pose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });
  
  // Set up the camera
  camera = new Camera(document.querySelector("video"), {
    onFrame: async () => {
      await detectPose();
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

async function detectPose() {
  const videoElement = document.querySelector('video');

  // Send video frame to MediaPipe for processing
  pose.send({ image: videoElement });

  // Get results once pose detection is complete
  pose.onResults((results) => {
    if (results.poseLandmarks) {
      console.log(results.poseLandmarks); // Pose landmarks (send this data to your backend)

      // Send pose data to backend
      sendPoseDataToBackend(results.poseLandmarks);
      
      // Example: Check if a person is performing a squat or push-up
      checkSquatOrPushup(results.poseLandmarks);
    }
  });
}

async function sendPoseDataToBackend(poseLandmarks) {
  const response = await fetch('http://your-backend-endpoint.com/pose-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ landmarks: poseLandmarks }),
  });

  const result = await response.json();
  console.log(result); // Handle the response (you can update UI with this result)
}

function checkSquatOrPushup(landmarks) {
  // For squat, check if the angle between knees and hips indicates a squat
  const kneeAngle = calculateKneeAngle(landmarks); // This is a simplified function
  const hipAngle = calculateHipAngle(landmarks);

  if (kneeAngle < 90 && hipAngle < 90) {
    console.log("Squat detected!");
  }
}

function calculateKneeAngle(landmarks) {
  // Calculate angle between knee, hip, and ankle landmarks
  // This is a simplified function, you'll need to calculate the angle based on landmarks
  return 80; // Placeholder value for testing
}

function calculateHipAngle(landmarks) {
  // Calculate angle based on hip landmarks
  return 80; // Placeholder value for testing
}

// Initialize camera when the page loads
initCamera();