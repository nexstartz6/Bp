import React, { useState, useEffect, useRef } from 'react';
import { HeartIcon, DropletIcon, ActivityIcon, CameraOnIcon, CameraOffIcon, CameraIcon as CameraPlaceholderIcon } from './Icons';

// Helper function to generate a random number within a range
const randomInRange = (min: number, max: number, decimals: number = 0) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

// A single data card component
const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  colorClass: string;
}> = ({ icon, label, value, unit, colorClass }) => (
  <div className={`bg-white/70 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-amber-200/50 flex items-center space-x-3 sm:space-x-4 shadow-lg ${colorClass}`}>
    <div className="text-2xl sm:text-3xl">{icon}</div>
    <div>
      <div className="text-xs sm:text-sm text-gray-600 font-light uppercase tracking-wider">{label}</div>
      <div className="text-xl sm:text-2xl font-bold text-gray-800">
        {value} <span className="text-base font-normal text-gray-500">{unit}</span>
      </div>
    </div>
  </div>
);

const ScanningUI: React.FC = () => (
    <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-xs h-64">
            <div className="absolute inset-0 border-2 border-amber-400 rounded-xl animate-pulse"></div>
            <div className="absolute inset-2 border-2 border-amber-400/50 rounded-xl animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-xl">
                <p className="text-white font-semibold text-lg">SCANNING</p>
                <p className="text-amber-300 text-sm">Searching for human subject...</p>
            </div>
        </div>
    </div>
);

const CameraOffUI: React.FC = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 text-white">
        <div className="text-amber-300 w-16 h-16 mb-4">
            <CameraPlaceholderIcon />
        </div>
        <h3 className="text-xl font-semibold">Camera is Off</h3>
        <p className="text-sm text-gray-300 max-w-xs">
            Tap the camera icon in the top right corner to start the AR health monitor.
        </p>
    </div>
);


export const ARView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [status, setStatus] = useState<'scanning' | 'detected' | 'error'>('scanning');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [heartRate, setHeartRate] = useState(75);
  const [sugarLevel, setSugarLevel] = useState(95.0);

  const toggleCamera = () => {
    setIsCameraOn(prev => {
        if (!prev) { // If we are turning the camera ON
            setStatus('scanning');
            setErrorMessage(null);
        }
        return !prev;
    });
  };

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
          });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
          setErrorMessage(
            'Camera access denied. Please allow camera permissions in your browser settings to use the AR feature.'
          );
          setStatus('error');
        }
      } else {
        setErrorMessage('Your browser does not support camera access.');
        setStatus('error');
      }
    };

    const stopCamera = () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera(); // Cleanup on component unmount
    };
  }, [isCameraOn]);

  useEffect(() => {
    if (!isCameraOn || status !== 'scanning') return;

    const timer = setTimeout(() => {
      setStatus('detected');
    }, 3500); // Simulate a 3.5-second scan

    return () => clearTimeout(timer);
  }, [isCameraOn, status]);

  useEffect(() => {
    if (status !== 'detected') return;

    const interval = setInterval(() => {
      setSystolic((prev) => Math.min(180, Math.max(90, prev + randomInRange(-2, 2))));
      setDiastolic((prev) => Math.min(120, Math.max(60, prev + randomInRange(-1, 1))));
      setHeartRate((prev) => Math.min(160, Math.max(50, prev + randomInRange(-3, 3))));
      setSugarLevel((prev) => Math.min(180, Math.max(70, prev + randomInRange(-1.5, 1.5, 1))));
    }, 2000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="relative w-full h-[calc(100vh-120px)] sm:h-[calc(100vh-130px)] overflow-hidden bg-gray-800">
      <button 
        onClick={toggleCamera} 
        className="absolute top-4 right-4 z-20 bg-white/50 backdrop-blur-sm p-3 rounded-full text-amber-500 hover:bg-white/70 transition-all"
        aria-label={isCameraOn ? "Turn camera off" : "Turn camera on"}
      >
        {isCameraOn ? <CameraOffIcon /> : <CameraOnIcon />}
      </button>

      {isCameraOn ? (
        <>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100" // Flip for user-facing camera
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
            
            {status === 'error' && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-800/80 p-6 rounded-lg text-center max-w-sm text-white">
                <h3 className="text-lg font-bold mb-2">Error</h3>
                <p>{errorMessage}</p>
                </div>
            )}

            {status === 'scanning' && <ScanningUI />}
            
            {status === 'detected' && (
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <InfoCard 
                    icon={<HeartIcon />} 
                    label="Blood Pressure" 
                    value={`${Math.round(systolic)}/${Math.round(diastolic)}`} 
                    unit="mmHg"
                    colorClass="text-red-500"
                    />
                    <InfoCard 
                    icon={<ActivityIcon />} 
                    label="Heart Rate" 
                    value={Math.round(heartRate).toString()} 
                    unit="BPM"
                    colorClass="text-pink-500"
                    />
                    <InfoCard 
                    icon={<DropletIcon />} 
                    label="Blood Sugar" 
                    value={sugarLevel.toFixed(1)} 
                    unit="mg/dL"
                    colorClass="text-blue-500"
                    />
                    <div className="bg-white/70 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-amber-200/50 flex items-center justify-center text-center shadow-lg col-span-2 sm:col-span-1">
                    <div className="text-green-500">
                        <div className="text-xs sm:text-sm uppercase tracking-wider text-gray-600">Status</div>
                        <div className="text-xl sm:text-2xl font-bold">NORMAL</div>
                    </div>
                    </div>
                </div>
                </div>
            )}
        </>
      ) : (
        <CameraOffUI />
      )}
    </div>
  );
};