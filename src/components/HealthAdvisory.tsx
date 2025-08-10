import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Activity, 
  Heart, 
  Shield, 
  Sun, 
  Droplets,
  Bug,
  Thermometer,
  Eye,
  Baby,
  ChevronRight,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface HealthAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  icon: any;
  color: string;
  advice: string[];
  preventionTips: string[];
  whenToSeekHelp: string;
}

const healthAlerts: HealthAlert[] = [
  {
    id: 'malaria',
    title: 'Malaria Prevention',
    description: 'Nigeria accounts for 27% of global malaria cases. Stay protected during rainy season.',
    severity: 'high',
    icon: Bug,
    color: 'red',
    advice: [
      'Use insecticide-treated nets (ITNs) every night',
      'Apply mosquito repellent containing DEET',
      'Wear long-sleeved clothing during peak mosquito hours (dusk to dawn)',
      'Keep surroundings clean and eliminate stagnant water'
    ],
    preventionTips: [
      'Clear gutters and containers that collect water',
      'Use indoor residual spraying if available',
      'Take antimalarial drugs as prescribed if traveling to high-risk areas'
    ],
    whenToSeekHelp: 'Seek immediate medical attention for fever, chills, headache, or body aches lasting more than 24 hours'
  },
  {
    id: 'cholera',
    title: 'Cholera Outbreak Alert',
    description: 'Waterborne disease outbreaks common during rainy season. Practice safe hygiene.',
    severity: 'high',
    icon: Droplets,
    color: 'blue',
    advice: [
      'Drink only boiled or bottled water',
      'Eat hot, freshly cooked food',
      'Avoid street vendor food and ice',
      'Wash hands frequently with soap and clean water'
    ],
    preventionTips: [
      'Use oral rehydration salts (ORS) for diarrhea',
      'Avoid raw or undercooked seafood',
      'Ensure proper sanitation in your environment'
    ],
    whenToSeekHelp: 'Seek help immediately for severe diarrhea, vomiting, or signs of dehydration'
  },
  {
    id: 'heat-stress',
    title: 'Heat-Related Illness',
    description: 'High temperatures in northern Nigeria can cause heat exhaustion and heat stroke.',
    severity: 'medium',
    icon: Sun,
    color: 'orange',
    advice: [
      'Stay hydrated - drink water regularly',
      'Avoid outdoor activities during peak sun hours (10am-4pm)',
      'Wear light-colored, loose-fitting clothing',
      'Seek shade or air-conditioned spaces when possible'
    ],
    preventionTips: [
      'Use umbrellas or hats when outdoors',
      'Take cool showers or baths',
      'Eat light, frequent meals'
    ],
    whenToSeekHelp: 'Seek help for dizziness, nausea, rapid heartbeat, or confusion in hot weather'
  },
  {
    id: 'hypertension',
    title: 'Hypertension Management',
    description: 'High blood pressure affects 1 in 3 Nigerian adults. Regular monitoring is crucial.',
    severity: 'medium',
    icon: Heart,
    color: 'red',
    advice: [
      'Check blood pressure regularly',
      'Reduce salt intake in your diet',
      'Exercise regularly - even walking helps',
      'Maintain a healthy weight'
    ],
    preventionTips: [
      'Limit alcohol consumption',
      'Quit smoking if you smoke',
      'Manage stress through relaxation techniques',
      'Eat more fruits and vegetables'
    ],
    whenToSeekHelp: 'See a doctor if blood pressure consistently reads above 140/90 mmHg'
  },
  {
    id: 'diabetes',
    title: 'Diabetes Prevention',
    description: 'Rising diabetes rates in urban areas. Early detection and lifestyle changes are key.',
    severity: 'medium',
    icon: Activity,
    color: 'purple',
    advice: [
      'Monitor blood sugar levels if at risk',
      'Maintain a balanced diet with less sugar',
      'Exercise for at least 30 minutes daily',
      'Maintain healthy body weight'
    ],
    preventionTips: [
      'Choose whole grains over refined carbohydrates',
      'Limit sugary drinks and processed foods',
      'Include fiber-rich foods in your diet'
    ],
    whenToSeekHelp: 'See a doctor for excessive thirst, frequent urination, or unexplained weight loss'
  },
  {
    id: 'maternal-health',
    title: 'Maternal Health',
    description: 'Ensuring safe pregnancy and childbirth through regular prenatal care.',
    severity: 'high',
    icon: Baby,
    color: 'pink',
    advice: [
      'Attend all antenatal care appointments',
      'Take folic acid supplements before and during pregnancy',
      'Deliver in a health facility with skilled attendants',
      'Get postnatal check-ups within 48 hours after delivery'
    ],
    preventionTips: [
      'Eat iron-rich foods to prevent anemia',
      'Avoid alcohol and smoking during pregnancy',
      'Get vaccinated against tetanus'
    ],
    whenToSeekHelp: 'Seek immediate help for bleeding, severe headaches, or unusual symptoms during pregnancy'
  }
];

export default function HealthAdvisory() {
  const [selectedAlert, setSelectedAlert] = useState<HealthAlert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 dark:from-slate-900 dark:via-emerald-900 dark:to-blue-900">
      <div className="relative">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        
        <div className="relative p-6 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="relative mb-6">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-600 rounded-3xl opacity-20 blur-2xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <h1 className="relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-800 bg-clip-text text-transparent mb-4">
                Health Advisory
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium">
              Get personalized health advice and evidence-based recommendations from leading medical professionals.
            </p>
          </motion.div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthAlerts.map((alert, index) => {
                const IconComponent = alert.icon;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-xl bg-${alert.color}-100 dark:bg-${alert.color}-900/30`}>
                            <IconComponent className={`h-6 w-6 text-${alert.color}-600 dark:text-${alert.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-lg text-slate-800 dark:text-white">{alert.title}</h3>
                              <Badge className={`${getSeverityBadge(alert.severity)} px-3 py-1`}>
                                {alert.severity}
                              </Badge>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">{alert.description}</p>
                            <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                              <span>Learn more</span>
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <selectedAlert.icon className={`h-6 w-6 text-${selectedAlert.color}-600`} />
                    <h2 className="text-xl font-bold">{selectedAlert.title}</h2>
                    <Badge className={getSeverityBadge(selectedAlert.severity)}>
                      {selectedAlert.severity} priority
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAlert(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-gray-700 mb-6">{selectedAlert.description}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Key Advice:</h3>
                    <ul className="space-y-1">
                      {selectedAlert.advice.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Prevention Tips:</h3>
                    <ul className="space-y-1">
                      {selectedAlert.preventionTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          <span className="text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>When to Seek Medical Help</AlertTitle>
                    <AlertDescription>
                      {selectedAlert.whenToSeekHelp}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}