import { useEffect, useRef, useState, useCallback } from 'react';

interface CameraPresenceOptions {
  onPersonArrived?: () => void;
  onPersonDeparted?: () => void;
  enabled?: boolean;
}

export function useCameraPresence({
  onPersonArrived,
  onPersonDeparted,
  enabled = true,
}: CameraPresenceOptions) {
  const [isPersonPresent, setIsPersonPresent] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [motionScore, setMotionScore] = useState<number>(0);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevFrameDataRef = useRef<Uint8ClampedArray | null>(null);
  const intervalRef = useRef<any>(null);
  const departedTimerRef = useRef<any>(null);
  const isPersonPresentRef = useRef<boolean>(false);

  // Keep ref in sync
  isPersonPresentRef.current = isPersonPresent;

  const handleDetectedArrival = useCallback(() => {
    if (!isPersonPresentRef.current) {
      setIsPersonPresent(true);
      isPersonPresentRef.current = true;
      if (departedTimerRef.current) clearTimeout(departedTimerRef.current);
      onPersonArrived?.();
    } else {
      // Refresh presence, reset departure timer
      if (departedTimerRef.current) clearTimeout(departedTimerRef.current);
      departedTimerRef.current = setTimeout(() => {
        setIsPersonPresent(false);
        isPersonPresentRef.current = false;
        onPersonDeparted?.();
      }, 8000); // 8 seconds without person in camera frame = person departed
    }
  }, [onPersonArrived, onPersonDeparted]);

  // Setup camera stream and optical difference analyzer
  useEffect(() => {
    if (!enabled) return;

    let mediaStream: MediaStream | null = null;
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    videoRef.current = video;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 48;
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const initCamera = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
        });
        video.srcObject = mediaStream;
        await video.play();
        setCameraActive(true);

        // Frame difference motion analyzer
        intervalRef.current = setInterval(() => {
          if (!ctx || video.readyState < 2) return;

          ctx.drawImage(video, 0, 0, 64, 48);
          const frame = ctx.getImageData(0, 0, 64, 48);
          const data = frame.data;

          if (prevFrameDataRef.current) {
            let diff = 0;
            const prev = prevFrameDataRef.current;
            for (let i = 0; i < data.length; i += 4) {
              const rDiff = Math.abs(data[i] - prev[i]);
              const gDiff = Math.abs(data[i + 1] - prev[i + 1]);
              const bDiff = Math.abs(data[i + 2] - prev[i + 2]);
              if (rDiff + gDiff + bDiff > 60) {
                diff++;
              }
            }

            const motionPercentage = Math.round((diff / (64 * 48)) * 100);
            setMotionScore(motionPercentage);

            // Motion threshold: person moving in front of camera lens
            if (motionPercentage > 4) {
              handleDetectedArrival();
            }
          }

          prevFrameDataRef.current = new Uint8ClampedArray(data);
        }, 400);
      } catch (err) {
        console.info('[CameraPresence] Physical webcam not available or permission withheld, simulation enabled:', err);
        setCameraActive(false);
      }
    };

    initCamera();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (departedTimerRef.current) clearTimeout(departedTimerRef.current);
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [enabled, handleDetectedArrival]);

  // Manual toggle for simulation / exhibition demo
  const simulatePersonApproach = useCallback(() => {
    setIsSimulated(true);
    handleDetectedArrival();
  }, [handleDetectedArrival]);

  const simulatePersonDeparture = useCallback(() => {
    setIsSimulated(false);
    setIsPersonPresent(false);
    isPersonPresentRef.current = false;
    onPersonDeparted?.();
  }, [onPersonDeparted]);

  return {
    isPersonPresent,
    cameraActive,
    motionScore,
    isSimulated,
    simulatePersonApproach,
    simulatePersonDeparture,
  };
}
