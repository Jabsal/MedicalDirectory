import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, User, Phone, Mail, FileText, Stethoscope } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Hospital } from "@shared/schema";

interface AppointmentBookingProps {
  hospital: Hospital;
  children: React.ReactNode;
}

interface AppointmentFormData {
  hospitalId: number;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  reasonForVisit: string;
  specialtyNeeded?: string;
}

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const commonSpecialties = [
  "General Medicine",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Surgery",
  "Emergency Medicine",
  "Internal Medicine",
  "Dermatology"
];

export default function AppointmentBooking({ hospital, children }: AppointmentBookingProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AppointmentFormData>({
    hospitalId: hospital.id,
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    appointmentDate: "",
    appointmentTime: "",
    reasonForVisit: "",
    specialtyNeeded: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const appointmentMutation = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to book appointment');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Appointment Request Submitted",
        description: data.message || "The hospital will contact you to confirm your appointment.",
      });
      
      // Reset form and close dialog
      setFormData({
        hospitalId: hospital.id,
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        appointmentDate: "",
        appointmentTime: "",
        reasonForVisit: "",
        specialtyNeeded: ""
      });
      setOpen(false);

      // Invalidate appointments cache
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || 
        !formData.appointmentDate || !formData.appointmentTime || !formData.reasonForVisit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.patientEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation (Nigerian format)
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    if (!phoneRegex.test(formData.patientPhone.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Nigerian phone number.",
        variant: "destructive",
      });
      return;
    }

    // Date validation (must be future date)
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast({
        title: "Invalid Date",
        description: "Please select a future date.",
        variant: "destructive",
      });
      return;
    }

    appointmentMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get maximum date (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto glass-effect border-2 border-primary/20 shadow-premium-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-gradient-primary text-xl">
            <Calendar className="h-6 w-6" />
            Book Appointment
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Schedule an appointment with {hospital.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Patient Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="patientName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="patientEmail"
                type="email"
                value={formData.patientEmail}
                onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="patientPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="patientPhone"
                value={formData.patientPhone}
                onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                placeholder="+234 800 123 4567"
                required
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Appointment Details</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date *
                </Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => handleInputChange('appointmentDate', e.target.value)}
                  min={minDate}
                  max={maxDateStr}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time *
                </Label>
                <Select
                  value={formData.appointmentTime}
                  onValueChange={(value) => handleInputChange('appointmentTime', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialtyNeeded" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Specialty (Optional)
              </Label>
              <Select
                value={formData.specialtyNeeded}
                onValueChange={(value) => handleInputChange('specialtyNeeded', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty if needed" />
                </SelectTrigger>
                <SelectContent>
                  {commonSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reasonForVisit" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reason for Visit *
              </Label>
              <Textarea
                id="reasonForVisit"
                value={formData.reasonForVisit}
                onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                placeholder="Please describe your symptoms or reason for the visit..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Hospital Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
            <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-1">
              {hospital.name}
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {hospital.address}, {hospital.city}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Phone: {hospital.phoneNumber}
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={appointmentMutation.isPending}
              className="px-6 py-3 glass-effect hover:scale-105 transition-transform duration-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={appointmentMutation.isPending}
              className="btn-premium px-8 py-3 text-white font-semibold hover:scale-105"
            >
              {appointmentMutation.isPending ? "Booking..." : "Book Appointment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}