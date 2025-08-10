import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Hospital as HospitalIcon, UserMinus, Phone, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Hospital as HospitalType, Specialist } from '@shared/schema';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom hospital marker icon (red)
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom specialist marker icon (blue)
const specialistIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapViewProps {
  hospitals?: HospitalType[];
  specialists?: Specialist[];
  onViewHospitalDetails?: (id: number) => void;
  onViewSpecialistDetails?: (id: number) => void;
  onBookAppointment?: (id: number) => void;
}

export default function MapView({ 
  hospitals = [], 
  specialists = [], 
  onViewHospitalDetails,
  onViewSpecialistDetails,
  onBookAppointment
}: MapViewProps) {
  // Default center for Nigeria (Lagos coordinates)
  const defaultCenter: [number, number] = [6.5244, 3.3792];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [mapZoom, setMapZoom] = useState(10);

  // Calculate map bounds to fit all markers
  useEffect(() => {
    const allMarkers = [
      ...hospitals.filter(h => h.latitude && h.longitude).map(h => ({ lat: h.latitude!, lng: h.longitude! })),
      ...specialists.filter(s => s.latitude && s.longitude).map(s => ({ lat: s.latitude!, lng: s.longitude! }))
    ];

    if (allMarkers.length > 0) {
      // Calculate center point
      const avgLat = allMarkers.reduce((sum, marker) => sum + marker.lat, 0) / allMarkers.length;
      const avgLng = allMarkers.reduce((sum, marker) => sum + marker.lng, 0) / allMarkers.length;
      setMapCenter([avgLat, avgLng]);
      
      // Adjust zoom based on spread of markers
      if (allMarkers.length === 1) {
        setMapZoom(15);
      } else {
        const latSpread = Math.max(...allMarkers.map(m => m.lat)) - Math.min(...allMarkers.map(m => m.lat));
        const lngSpread = Math.max(...allMarkers.map(m => m.lng)) - Math.min(...allMarkers.map(m => m.lng));
        const maxSpread = Math.max(latSpread, lngSpread);
        
        if (maxSpread < 0.1) setMapZoom(12);
        else if (maxSpread < 0.5) setMapZoom(10);
        else if (maxSpread < 1) setMapZoom(8);
        else setMapZoom(7);
      }
    }
  }, [hospitals, specialists]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        {/* Free OpenStreetMap tiles - no API key required */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Hospital markers */}
        {hospitals
          .filter(hospital => hospital.latitude && hospital.longitude)
          .map(hospital => (
            <Marker
              key={`hospital-${hospital.id}`}
              position={[hospital.latitude!, hospital.longitude!]}
              icon={hospitalIcon}
            >
              <Popup>
                <Card className="border-0 shadow-none">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">{hospital.name}</h3>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {hospital.address}, {hospital.city}
                      </div>
                      {hospital.phoneNumber && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {hospital.phoneNumber}
                        </div>
                      )}
                      {hospital.rating && (
                        <div className="flex items-center text-xs">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {hospital.rating}/5 ({hospital.reviewCount || 0} reviews)
                        </div>
                      )}
                      {hospital.specialties && hospital.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {hospital.specialties.slice(0, 3).map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                          {hospital.specialties.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{hospital.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          className="text-xs px-2 py-1 h-auto bg-green-600 hover:bg-green-700"
                          onClick={() => onViewHospitalDetails?.(hospital.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}

        {/* Specialist markers */}
        {specialists
          .filter(specialist => specialist.latitude && specialist.longitude)
          .map(specialist => (
            <Marker
              key={`specialist-${specialist.id}`}
              position={[specialist.latitude!, specialist.longitude!]}
              icon={specialistIcon}
            >
              <Popup>
                <Card className="border-0 shadow-none">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm">
                        Dr. {specialist.firstName} {specialist.lastName}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {specialist.specialty}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {specialist.address}, {specialist.city}
                      </div>
                      {specialist.phoneNumber && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {specialist.phoneNumber}
                        </div>
                      )}
                      {specialist.rating && (
                        <div className="flex items-center text-xs">
                          <Star className="h-3 w-3 mr-1 text-yellow-500" />
                          {specialist.rating}/5 ({specialist.reviewCount || 0} reviews)
                        </div>
                      )}
                      {specialist.languages && specialist.languages.length > 0 && (
                        <div className="text-xs text-gray-600">
                          Languages: {specialist.languages.join(', ')}
                        </div>
                      )}
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          className="text-xs px-2 py-1 h-auto bg-blue-600 hover:bg-blue-700"
                          onClick={() => onViewSpecialistDetails?.(specialist.id)}
                        >
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-2 py-1 h-auto"
                          onClick={() => onBookAppointment?.(specialist.id)}
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg text-xs z-[1000]">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span>Hospitals ({hospitals.filter(h => h.latitude && h.longitude).length})</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span>Specialists ({specialists.filter(s => s.latitude && s.longitude).length})</span>
        </div>
      </div>
    </div>
  );
}