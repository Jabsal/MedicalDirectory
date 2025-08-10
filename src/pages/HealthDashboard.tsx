import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Shield, 
  Activity, 
  AlertTriangle,
  CreditCard,
  MapPin,
  TrendingUp,
  Users,
  Calendar,
  Brain,
  Thermometer
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthAdvisory from "@/components/HealthAdvisory";
import DiseaseSurveillance from "@/components/DiseaseSurveillance";
import InsuranceLocator from "@/components/InsuranceLocator";

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
  description: string;
}

const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    title: 'Healthcare Facilities',
    value: '24,632',
    change: '+3.2%',
    trend: 'up',
    icon: Heart,
    color: 'red',
    description: 'Total registered healthcare facilities across Nigeria'
  },
  {
    id: '2',
    title: 'Medical Specialists',
    value: '15,847',
    change: '+5.1%',
    trend: 'up',
    icon: Users,
    color: 'blue',
    description: 'Qualified medical specialists in active practice'
  },
  {
    id: '3',
    title: 'Active Outbreaks',
    value: '4',
    change: '-1',
    trend: 'down',
    icon: AlertTriangle,
    color: 'orange',
    description: 'Current disease outbreaks under monitoring'
  },
  {
    id: '4',
    title: 'Vaccination Coverage',
    value: '68%',
    change: '+4.2%',
    trend: 'up',
    icon: Shield,
    color: 'green',
    description: 'Population coverage for essential vaccines'
  },
  {
    id: '5',
    title: 'Insurance Enrollment',
    value: '12.8M',
    change: '+8.5%',
    trend: 'up',
    icon: CreditCard,
    color: 'purple',
    description: 'Citizens enrolled in health insurance schemes'
  },
  {
    id: '6',
    title: 'Emergency Response',
    value: '97.2%',
    change: '+2.1%',
    trend: 'up',
    icon: Activity,
    color: 'pink',
    description: 'Emergency response system availability'
  }
];

const quickHealthTips = [
  {
    title: "Malaria Prevention",
    tip: "Use insecticide-treated nets and eliminate standing water around your home",
    priority: "high"
  },
  {
    title: "Hydration",
    tip: "Drink 8-10 glasses of clean water daily, especially during hot weather",
    priority: "medium"
  },
  {
    title: "Hand Hygiene",
    tip: "Wash hands frequently with soap for at least 20 seconds",
    priority: "high"
  },
  {
    title: "Vaccination",
    tip: "Keep your vaccinations up to date, including yellow fever and meningitis",
    priority: "medium"
  }
];

export default function HealthDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <Activity className="h-4 w-4 text-yellow-600" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">Nigeria Health Dashboard</h1>
            <p className="text-xl text-green-100">
              Comprehensive health monitoring and resources for Nigeria
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="surveillance">Disease Surveillance</TabsTrigger>
            <TabsTrigger value="advisory">Health Advisory</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                            <IconComponent className={`h-6 w-6 text-${metric.color}-600`} />
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                            <div className="flex items-center text-sm">
                              {getTrendIcon(metric.trend)}
                              <span className={`ml-1 ${
                                metric.trend === 'up' ? 'text-green-600' : 
                                metric.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                              }`}>
                                {metric.change}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-semibold text-gray-900">{metric.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Quick Health Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-blue-600" />
                  Quick Health Tips for Nigeria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickHealthTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 border-l-4 rounded-lg ${getPriorityColor(tip.priority)}`}
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                      <p className="text-sm text-gray-700">{tip.tip}</p>
                      <Badge 
                        className={`mt-2 ${
                          tip.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {tip.priority} priority
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Thermometer className="h-5 w-5 mr-2 text-red-600" />
                  Emergency Health Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h3 className="font-semibold text-red-900">Emergency Services</h3>
                    <p className="text-2xl font-bold text-red-600 mt-2">199</p>
                    <p className="text-sm text-red-700">National Emergency Number</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900">NCDC Hotline</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">080-9955-2000</p>
                    <p className="text-sm text-blue-700">Disease Control Center</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900">NHIS Helpline</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">0800-NHIS-HELP</p>
                    <p className="text-sm text-green-700">Health Insurance Support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveillance">
            <DiseaseSurveillance />
          </TabsContent>

          <TabsContent value="advisory">
            <HealthAdvisory />
          </TabsContent>

          <TabsContent value="insurance">
            <InsuranceLocator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}