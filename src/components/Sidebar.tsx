import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Hospital, 
  UserPlus, 
  Heart, 
  Calendar, 
  HelpCircle,
  MessageCircle,
  Activity,
  Shield,
  Users,
  Search,
  Bell,
  Settings,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { Hospital as HospitalType, Specialist } from "@shared/schema";

export function Sidebar() {
  // Fetch dynamic counts from database
  const { data: hospitals = [] } = useQuery<HospitalType[]>({
    queryKey: ["/api/hospitals"],
  });

  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: ["/api/specialists"],
  });

  const { data: carers = [] } = useQuery<any[]>({
    queryKey: ["/api/carers"],
  });

  const hospitalCount = hospitals.length;
  const specialistCount = specialists.length;
  const carerCount = carers.length;

  const menuItems = [
    { 
      id: "home", 
      href: "/", 
      icon: Home, 
      label: "Home", 
      active: true,
      description: "Healthcare search and discovery",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      id: "symptom-chat", 
      href: "/symptom-chat", 
      icon: MessageCircle, 
      label: "Symptom Chat",
      description: "AI-powered health consultation",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      id: "health-dashboard", 
      href: "/health-dashboard", 
      icon: Activity, 
      label: "Health Dashboard",
      description: "Your health analytics",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      id: "health-topics", 
      href: "/health-topics", 
      icon: Heart, 
      label: "Health Topics",
      description: "Medical knowledge base",
      gradient: "from-rose-500 to-orange-500"
    },

  ];

  return (
    <motion.div 
      className="hidden md:flex md:flex-shrink-0"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
    >
      <div className="flex flex-col w-72 sidebar-premium shadow-premium-lg relative overflow-hidden">
        {/* Premium background pattern */}
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="absolute inset-0 bg-pattern-premium"></div>
        
        {/* Header */}
        <motion.div 
          className="relative flex items-center justify-center h-20 px-6 border-b border-white/10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <motion.h1 
            className="text-2xl font-bold text-white flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="bg-white/20 p-3 rounded-xl mr-4 glass-effect"
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
            >
              <Heart className="h-7 w-7 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-extrabold text-white drop-shadow-lg">
                MediFind
              </span>
              <span className="text-xs text-white/80 font-medium">Healthcare Platform</span>
            </div>
          </motion.h1>
        </motion.div>
        {/* Premium Navigation */}
        <div className="relative flex-1 flex flex-col overflow-y-auto scrollbar-premium">
          <nav className="flex-1 px-4 py-6 space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.4 + index * 0.1,
                    type: "spring",
                    stiffness: 200 
                  }}
                  whileHover={{ scale: 1.03, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link href={item.href}>
                    <div className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 cursor-pointer border ${
                      item.active 
                        ? 'bg-white/25 backdrop-blur-md border-white/40 shadow-premium' 
                        : 'hover:bg-white/15 backdrop-blur-sm border-white/20 hover:border-white/40'
                    }`}>
                      {/* Gradient background overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none`}></div>
                      
                      <div className="relative flex items-center z-20">
                        <motion.div 
                          className="mr-4 p-2 rounded-xl bg-white/20 backdrop-blur-sm relative z-30"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Icon className="h-6 w-6 text-white drop-shadow-sm" />
                        </motion.div>
                        
                        <div className="flex-1 min-w-0 relative z-30">
                          <div className="text-white font-semibold text-base truncate drop-shadow-sm">
                            {item.label}
                          </div>
                          <div className="text-white/90 text-sm truncate">
                            {item.description}
                          </div>
                        </div>
                        
                        {item.active && (
                          <motion.div
                            className="ml-2 w-2 h-2 rounded-full bg-white relative z-30"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Premium Stats Section */}
          <motion.div 
            className="relative px-4 py-6 border-t border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-semibold">Quick Stats</span>
                <Sparkles className="h-5 w-5 text-white/70" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {hospitalCount > 0 ? hospitalCount : "---"}
                  </div>
                  <div className="text-xs text-white/60">Hospitals</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {specialistCount > 0 ? specialistCount : "---"}
                  </div>
                  <div className="text-xs text-white/60">Specialists</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-white">
                    {carerCount > 0 ? carerCount : "---"}
                  </div>
                  <div className="text-xs text-white/60">Carers</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Premium Footer */}
        <motion.div 
          className="relative px-4 py-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="mr-3 p-1 rounded-lg bg-white/20"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Users className="h-4 w-4 text-white" />
              </motion.div>
              <div>
                <div className="text-white text-sm font-medium">Welcome back!</div>
                <div className="text-white/60 text-xs">Healthcare explorer</div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
          
          {/* Premium notification indicator */}
          <motion.div 
            className="mt-3 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
          >
            <div className="flex items-center space-x-2 text-white/50 text-xs">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>All systems operational</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Sidebar;
