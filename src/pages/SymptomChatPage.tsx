import { useState } from 'react';
import { Link } from 'wouter';
import SymptomChat from '@/components/SymptomChat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  AlertTriangle, 
  Info,
  Shield,
  Clock
} from 'lucide-react';

export default function SymptomChatPage() {
  const [recommendedSpecialties, setRecommendedSpecialties] = useState<string[]>([]);

  const handleSpecialtyRecommendation = (specialties: string[]) => {
    setRecommendedSpecialties(specialties);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Symptom Analysis & Medical Guidance</h1>
          <p className="text-muted-foreground">
            Get personalized medical guidance based on your symptoms and find the right specialists
          </p>
        </div>
      </div>

      {/* Important Notice */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-orange-900">Important Medical Disclaimer</h3>
              <p className="text-sm text-orange-800">
                This tool provides general medical information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.
              </p>
              <div className="flex items-center gap-2 text-xs text-orange-700">
                <Shield className="h-4 w-4" />
                For emergencies, call 911 immediately
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <SymptomChat onSpecialtyRecommendation={handleSpecialtyRecommendation} />
        </div>

        {/* Sidebar with Information and Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {recommendedSpecialties.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Specialists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Based on your symptoms, these specialists can help:
                </p>
                <div className="space-y-2">
                  {recommendedSpecialties.map((specialty) => (
                    <div key={specialty} className="flex items-center justify-between">
                      <Badge variant="outline">{specialty}</Badge>
                      <Link href={`/?specialty=${encodeURIComponent(specialty)}`}>
                        <Button size="sm" variant="outline">
                          Find {specialty}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">1</div>
                  <div>
                    <h4 className="font-medium">Describe Symptoms</h4>
                    <p className="text-muted-foreground text-xs">Tell me about what you're experiencing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">2</div>
                  <div>
                    <h4 className="font-medium">Get Analysis</h4>
                    <p className="text-muted-foreground text-xs">Receive medical information and guidance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">3</div>
                  <div>
                    <h4 className="font-medium">Find Care</h4>
                    <p className="text-muted-foreground text-xs">Connect with recommended specialists</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* When to Seek Immediate Care */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Emergency Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-red-900">Call 911 immediately for:</p>
                <ul className="space-y-1 text-red-800 text-xs">
                  <li>• Severe chest pain or pressure</li>
                  <li>• Difficulty breathing</li>
                  <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
                  <li>• Severe bleeding</li>
                  <li>• Loss of consciousness</li>
                  <li>• Severe allergic reactions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tips for Better Results */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tips for Better Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>• Be specific about your symptoms</li>
                  <li>• Mention when symptoms started</li>
                  <li>• Describe pain intensity (1-10 scale)</li>
                  <li>• Note any triggering factors</li>
                  <li>• Mention relevant medical history</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}