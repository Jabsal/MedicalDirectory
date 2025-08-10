import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  CheckCircle,
  AlertCircle,
  Filter,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  hospital: string;
  address: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow-up' | 'surgery' | 'test';
  phoneNumber: string;
}

const appointments: Appointment[] = [
  {
    id: '1',
    date: '2024-06-15',
    time: '10:00 AM',
    doctor: 'Dr. Adebayo Ogundimu',
    specialty: 'Cardiology',
    hospital: 'Lagos University Teaching Hospital',
    address: 'Idi-Araba, Lagos',
    status: 'upcoming',
    type: 'consultation',
    phoneNumber: '+234-1-7743-666'
  },
  {
    id: '2',
    date: '2024-06-20',
    time: '2:30 PM',
    doctor: 'Dr. Fatima Ahmed',
    specialty: 'Pediatrics',
    hospital: 'National Hospital Abuja',
    address: 'Central Business District, Abuja',
    status: 'upcoming',
    type: 'follow-up',
    phoneNumber: '+234-9-461-3000'
  },
  {
    id: '3',
    date: '2024-06-10',
    time: '9:00 AM',
    doctor: 'Dr. Chinedu Okoro',
    specialty: 'Orthopedics',
    hospital: 'University College Hospital',
    address: 'Ibadan, Oyo State',
    status: 'completed',
    type: 'consultation',
    phoneNumber: '+234-2-241-3204'
  }
];

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      case 'test': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === 'upcoming') return appointment.status === 'upcoming';
    if (activeTab === 'completed') return appointment.status === 'completed';
    if (activeTab === 'cancelled') return appointment.status === 'cancelled';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">My Appointments</h1>
            <p className="text-xl text-blue-100">
              Manage your healthcare appointments and medical visits
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {appointments.filter(a => a.status === 'upcoming').length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {appointments.filter(a => a.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {appointments.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Appointments</CardTitle>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Book New Appointment
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <div className="space-y-4">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No {activeTab} appointments
                      </h3>
                      <p className="text-gray-600">
                        {activeTab === 'upcoming' 
                          ? "You don't have any upcoming appointments scheduled."
                          : `No ${activeTab} appointments found.`
                        }
                      </p>
                    </div>
                  ) : (
                    filteredAppointments.map((appointment, index) => (
                      <motion.div
                        key={appointment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <h3 className="text-lg font-semibold">{appointment.doctor}</h3>
                                  <Badge className={getStatusColor(appointment.status)}>
                                    {appointment.status}
                                  </Badge>
                                  <Badge className={getTypeColor(appointment.type)}>
                                    {appointment.type}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      {new Date(appointment.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {appointment.time}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <User className="h-4 w-4 mr-2" />
                                      {appointment.specialty}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex items-start text-sm text-gray-600">
                                      <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                                      <div>
                                        <div className="font-medium">{appointment.hospital}</div>
                                        <div>{appointment.address}</div>
                                      </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Phone className="h-4 w-4 mr-2" />
                                      {appointment.phoneNumber}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  {appointment.status === 'upcoming' && (
                                    <>
                                      <Button variant="outline" size="sm">
                                        Reschedule
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        Cancel
                                      </Button>
                                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                        View Details
                                      </Button>
                                    </>
                                  )}
                                  {appointment.status === 'completed' && (
                                    <>
                                      <Button variant="outline" size="sm">
                                        View Report
                                      </Button>
                                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                        Book Follow-up
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}