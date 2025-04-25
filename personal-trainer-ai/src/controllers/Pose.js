import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

let detector;

export async function usePoseDetection() {
  const loadModel = async () => {
    await tf.setBackend('webgl');
    await tf.ready();
    detector = await posedetection.createDetector(posedetection.SupportedModels.MoveNet, {
      modelType: 'SinglePose.Lightning',
    });
    console.log('✅ Pose model loaded');
  };

  const detectPose = async (videoElement) => {
    if (!detector) return null;

    const poses = await detector.estimatePoses(videoElement, {
      maxPoses: 1,
      flipHorizontal: false,
    });

    if (!poses.length) return null;

    return poses[0];
  };

  return {
    loadModel,
    detectPose,
  };
}