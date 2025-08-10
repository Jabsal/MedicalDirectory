interface HospitalSilhouetteProps {
  className?: string;
}

export default function HospitalSilhouette({ className = "w-full h-full" }: HospitalSilhouetteProps) {
  return (
    <div className={`bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center ${className}`}>
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-green-300"
      >
        {/* Main hospital building */}
        <rect x="20" y="30" width="80" height="50" fill="currentColor" opacity="0.6" />
        
        {/* Hospital entrance */}
        <rect x="50" y="50" width="20" height="30" fill="currentColor" opacity="0.8" />
        
        {/* Windows */}
        <rect x="25" y="35" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="37" y="35" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="75" y="35" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="87" y="35" width="8" height="8" fill="white" opacity="0.9" />
        
        <rect x="25" y="48" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="37" y="48" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="75" y="48" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="87" y="48" width="8" height="8" fill="white" opacity="0.9" />
        
        <rect x="25" y="61" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="37" y="61" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="75" y="61" width="8" height="8" fill="white" opacity="0.9" />
        <rect x="87" y="61" width="8" height="8" fill="white" opacity="0.9" />
        
        {/* Medical cross */}
        <rect x="56" y="38" width="8" height="20" fill="white" />
        <rect x="52" y="44" width="16" height="8" fill="white" />
        
        {/* Hospital sign */}
        <rect x="45" y="25" width="30" height="8" fill="currentColor" opacity="0.8" />
        
        {/* Ambulance entrance marking */}
        <rect x="48" y="75" width="24" height="5" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}