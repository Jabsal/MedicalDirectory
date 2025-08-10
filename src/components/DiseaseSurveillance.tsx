import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Calendar, 
  Eye, 
  Shield, 
  MapPin, 
  X, 
  ChevronRight 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DiseaseOutbreak {
  id: string;
  disease: string;
  location: string;
  state: string;
  cases: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastUpdated: string;
  description: string;
  riskLevel: number;
}

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

const diseaseOutbreaks: DiseaseOutbreak[] = [
  {
    id: '1',
    disease: 'Cholera',
    location: 'Lagos State',
    state: 'Lagos',
    cases: 234,
    trend: 'increasing',
    severity: 'high',
    lastUpdated: '2 hours ago',
    description: 'Outbreak reported in Lagos mainland with cases spreading to island areas.',
    riskLevel: 75
  },
  {
    id: '2',
    disease: 'Lassa Fever',
    location: 'Edo State',
    state: 'Edo',
    cases: 45,
    trend: 'stable',
    severity: 'medium',
    lastUpdated: '6 hours ago',
    description: 'Seasonal outbreak with cases under control in rural communities.',
    riskLevel: 45
  },
  {
    id: '3',
    disease: 'Yellow Fever',
    location: 'Bauchi State',
    state: 'Bauchi',
    cases: 12,
    trend: 'decreasing',
    severity: 'low',
    lastUpdated: '1 day ago',
    description: 'Vaccination campaign showing positive results in affected areas.',
    riskLevel: 25
  }
];

const healthMetrics: HealthMetric[] = [
  {
    id: '1',
    title: 'Active Disease Alerts',
    value: '23',
    change: -8,
    trend: 'down',
    icon: AlertCircle,
    color: 'red'
  },
  {
    id: '2',
    title: 'Health Facilities Monitoring',
    value: '1,247',
    change: 12,
    trend: 'up',
    icon: Activity,
    color: 'blue'
  },
  {
    id: '3',
    title: 'Vaccination Coverage',
    value: '68%',
    change: 5,
    trend: 'up',
    icon: Shield,
    color: 'green'
  },
  {
    id: '4',
    title: 'Population Under Surveillance',
    value: '45M',
    change: 0,
    trend: 'up',
    icon: Users,
    color: 'purple'
  }
];

export default function DiseaseSurveillance() {
  const [selectedOutbreak, setSelectedOutbreak] = useState<DiseaseOutbreak | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getRiskColor = (riskLevel: number) => {
    if (riskLevel >= 70) return 'bg-red-500';
    if (riskLevel >= 50) return 'bg-orange-500';
    if (riskLevel >= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-900 dark:to-emerald-900">
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
                className="absolute -inset-4 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-3xl opacity-20 blur-2xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <h1 className="relative text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-transparent mb-4">
                Disease Surveillance
              </h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-medium mb-8">
              Real-time monitoring of disease outbreaks and health trends across Nigeria's 36 states with advanced analytics and alerts.
            </p>
            
            <div className="flex justify-center items-center space-x-4">
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                Live Monitoring
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                Updated Today
              </Badge>
            </div>
          </motion.div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthMetrics.map((metric, index) => {
                const IconComponent = metric.icon;
                return (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                        <IconComponent className={`h-6 w-6 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">{metric.value}</div>
                        <div className={`text-sm flex items-center ${
                          metric.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {metric.trend === 'up' ? '↗' : '↘'} {metric.change}%
                        </div>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300">{metric.title}</h3>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {diseaseOutbreaks.map((outbreak, index) => (
                <motion.div
                  key={outbreak.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedOutbreak(outbreak)}
                >
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">{outbreak.disease}</h3>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mb-2">
                            <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                            {outbreak.location}
                          </div>
                        </div>
                        <Badge className={getSeverityColor(outbreak.severity)}>
                          {outbreak.severity}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Cases</span>
                          <span className="font-bold text-slate-800 dark:text-white">{outbreak.cases}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Trend</span>
                          <div className="flex items-center">
                            {getTrendIcon(outbreak.trend)}
                            <span className="ml-1 text-sm font-medium capitalize">{outbreak.trend}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Risk Level</span>
                            <span className="text-sm font-bold">{outbreak.riskLevel}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getRiskColor(outbreak.riskLevel)} transition-all duration-300`}
                              style={{ width: `${outbreak.riskLevel}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-600">
                          <span>Updated {outbreak.lastUpdated}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}