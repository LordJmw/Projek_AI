import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import axios from 'axios';

export default class AICamera {
  constructor(videoElement) {
    this.videoElement = videoElement;
    this.detector = null;
    this.running = false;
  }

  async init() {
    await tf.setBackend('webgl');
    await tf.ready();

    this.detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
      modelType: posedetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    });

    this.running = true;
    this.detectPose();
  }

  async detectPose() {
    const detect = async () => {
      if (!this.running || !this.detector) return;

      const poses = await this.detector.estimatePoses(this.videoElement, {
        maxPoses: 1,
        flipHorizontal: false
      });

      if (poses && poses.length > 0) {
        const keypoints = poses[0].keypoints.map(kp => ({
          x: kp.x,
          y: kp.y,
          score: kp.score
        }));

        this.sendKeypointsToBackend(keypoints);
      }

      requestAnimationFrame(detect);
    };

    detect();
  }

  stop() {
    this.running = false;
  }

  async sendKeypointsToBackend(keypoints) {
    try {
      const response = await axios.post('http://localhost:3000/ai/analyze-squat', { keypoints });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending keypoints:', error);
    }
  }
}