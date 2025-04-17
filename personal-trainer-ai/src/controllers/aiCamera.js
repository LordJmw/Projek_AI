// src/controller/aiCamera.js
import * as cam from '@mediapipe/camera_utils';
import * as mpPose from '@mediapipe/pose';
import axios from 'axios';

export default class AICamera {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.pose = new mpPose.Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file.replace('_simd', '')}`,
      });
    this.pose.onResults(this.onResults.bind(this));
  }

  start() {
    const camera = new cam.Camera(this.videoElement, {
      onFrame: async () => {
        await this.pose.send({ image: this.videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }

  onResults(results) {
    if (results.poseLandmarks) {
      const keypoints = results.poseLandmarks.map(landmark => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility,
      }));
      
      this.sendKeypointsToBackend(keypoints);
    }
  }

  async sendKeypointsToBackend(keypoints) {
    try {
      const response = await axios.post('http://localhost:3000/ai/analyze-squat', { keypoints });
      console.log(response.data);
    } catch (error) {
      console.error("Error sending keypoints:", error);
    }
  }
}
