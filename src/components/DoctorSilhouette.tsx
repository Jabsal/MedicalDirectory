interface DoctorSilhouetteProps {
  className?: string;
}

export default function DoctorSilhouette({ className = "h-16 w-16" }: DoctorSilhouetteProps) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-blue-300"
      >
        {/* Doctor's head/face */}
        <circle cx="20" cy="14" r="8" fill="currentColor" opacity="0.6" />
        
        {/* Doctor's body/coat */}
        <path
          d="M8 38 C8 28, 12 26, 20 26 C28 26, 32 28, 32 38 Z"
          fill="currentColor"
          opacity="0.6"
        />
        
        {/* Stethoscope */}
        <path
          d="M16 20 Q18 18, 20 20 Q22 18, 24 20"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
        <circle cx="16" cy="22" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="24" cy="22" r="1.5" fill="currentColor" opacity="0.8" />
        
        {/* Medical cross on coat */}
        <rect x="18" y="28" width="4" height="8" fill="white" opacity="0.9" />
        <rect x="16" y="30" width="8" height="4" fill="white" opacity="0.9" />
      </svg>
    </div>
  );
}