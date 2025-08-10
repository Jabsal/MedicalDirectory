import { Switch, Route } from "wouter";
import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import { User } from "lucide-react";

import Home from "@/pages/Home";
import HospitalDetail from "@/pages/HospitalDetail";
import SpecialistDetail from "@/pages/SpecialistDetail";
import HealthTopics from "@/pages/HealthTopics";
import HealthDashboard from "@/pages/HealthDashboard";
import Appointments from "@/pages/Appointments";
import FAQs from "@/pages/FAQs";
import SymptomChatPage from "@/pages/SymptomChatPage";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
        
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar for tablet and larger */}
          <Sidebar />
          
          {/* Main content */}
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Top navigation for mobile */}
            <div className="md:hidden bg-primary text-white">
              <div className="flex items-center justify-between h-16 px-4">
                <div className="flex items-center">
                  <MobileMenu />
                  <h1 className="ml-3 text-xl font-bold">MediFind</h1>
                </div>
                <div>
                  <button type="button" className="p-1 text-white focus:outline-none">
                    <User className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Page content */}
            <main className="flex-1 relative overflow-y-auto focus:outline-none">
              <Router />
            </main>
          </div>
        </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hospital/:id" component={HospitalDetail} />
      <Route path="/specialist/:id" component={SpecialistDetail} />
      <Route path="/symptom-chat" component={SymptomChatPage} />
      <Route path="/health-topics" component={HealthTopics} />
      <Route path="/health-dashboard" component={HealthDashboard} />
      <Route path="/appointments" component={Appointments} />
      <Route path="/faqs" component={FAQs} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
