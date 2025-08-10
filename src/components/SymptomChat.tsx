import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  AlertTriangle, 
  Clock, 
  Stethoscope,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { analyzeSymptoms, generateFollowUpQuestions, Condition } from '@/data/medicalKnowledge';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  analysis?: {
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
    possibleConditions: Condition[];
    recommendedSpecialties: string[];
    advice: string;
  };
}

interface SymptomChatProps {
  onSpecialtyRecommendation?: (specialties: string[]) => void;
}

export default function SymptomChat({ onSpecialtyRecommendation }: SymptomChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm here to help you understand your symptoms and guide you to the right medical care. Please describe what you're experiencing, and I'll provide information based on medical knowledge. \n\n⚠️ **Important**: This is for informational purposes only and is not a substitute for professional medical advice.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsAnalyzing(true);

    // Simulate thinking time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analyze symptoms
    const analysis = analyzeSymptoms(inputValue);
    
    let botResponse = '';
    if (analysis.identifiedSymptoms.length > 0) {
      botResponse = `I've identified the following from your description:\n\n`;
      
      // Add identified symptoms
      botResponse += `**Symptoms detected:**\n`;
      analysis.identifiedSymptoms.forEach(symptom => {
        botResponse += `• ${symptom.name}\n`;
      });
      
      botResponse += `\n**${analysis.advice}**\n\n`;
      
      // Add possible conditions if any
      if (analysis.possibleConditions.length > 0) {
        botResponse += `**Possible conditions to consider:**\n`;
        analysis.possibleConditions.slice(0, 3).forEach(condition => {
          botResponse += `• **${condition.name}**: ${condition.description}\n`;
        });
        botResponse += `\n`;
      }
      
      // Add recommended specialties
      if (analysis.recommendedSpecialties.length > 0) {
        botResponse += `**Recommended specialists:**\n`;
        analysis.recommendedSpecialties.forEach(specialty => {
          botResponse += `• ${specialty}\n`;
        });
        botResponse += `\n`;
      }
      
      // Generate follow-up questions
      const followUpQuestions = generateFollowUpQuestions(analysis.identifiedSymptoms);
      if (followUpQuestions.length > 0) {
        botResponse += `**Questions to help me understand better:**\n`;
        followUpQuestions.forEach((question, index) => {
          botResponse += `${index + 1}. ${question}\n`;
        });
      }
      
      // Call the callback with recommended specialties
      if (onSpecialtyRecommendation && analysis.recommendedSpecialties.length > 0) {
        onSpecialtyRecommendation(analysis.recommendedSpecialties);
      }
    } else {
      botResponse = analysis.advice;
    }

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: botResponse,
      timestamp: new Date(),
      analysis: analysis.identifiedSymptoms.length > 0 ? analysis : undefined
    };

    setMessages(prev => [...prev, botMessage]);
    setIsAnalyzing(false);
    
    // Focus back on input
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <Stethoscope className="h-4 w-4" />;
      default: return <Stethoscope className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Symptom Analysis Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Describe your symptoms to get personalized medical guidance
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 gap-4 p-4">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div 
                  key={message.id} 
                  className="space-y-2"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  layout
                >
                  <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <motion.div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </motion.div>
                    
                      <motion.div 
                        className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                
                {/* Analysis Summary */}
                {message.analysis && (
                  <div className="ml-11 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getUrgencyColor(message.analysis.urgencyLevel)} className="gap-1">
                        {getUrgencyIcon(message.analysis.urgencyLevel)}
                        {message.analysis.urgencyLevel.toUpperCase()} PRIORITY
                      </Badge>
                      
                      {message.analysis.recommendedSpecialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                    
                    {message.analysis.possibleConditions.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Possible conditions: {message.analysis.possibleConditions.slice(0, 2).map(c => c.name).join(', ')}
                        {message.analysis.possibleConditions.length > 2 && ` and ${message.analysis.possibleConditions.length - 2} more`}
                      </div>
                    )}
                  </div>
                )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Analyzing indicator */}
            {isAnalyzing && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    Analyzing symptoms...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <Separator />
        
        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your symptoms... (e.g., 'I have a severe headache and feel nauseous')"
            disabled={isAnalyzing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isAnalyzing}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Start Suggestions */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {[
              'I have a headache and feel dizzy',
              'Chest pain and shortness of breath',
              'Persistent cough for a week',
              'Joint pain in my knees'
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInputValue(suggestion)}
                className="text-left justify-start h-auto py-2 px-3"
              >
                <ArrowRight className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="text-xs">{suggestion}</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}