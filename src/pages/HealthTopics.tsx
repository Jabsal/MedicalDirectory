import { useState } from "react";
import { Heart, ArrowRight, Activity, Pill, Thermometer, Stethoscope, Dumbbell, Apple, Zap, Baby } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Footer from "../components/Footer";

// Health topic card component
function HealthTopicCard({ 
  title, 
  description, 
  image, 
  tags,
  icon: Icon
}: { 
  title: string; 
  description: string; 
  image: string; 
  tags: string[];
  icon: React.ElementType;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="h-44 w-full overflow-hidden relative">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 bg-white rounded-full p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="line-clamp-2 mb-3">{description}</CardDescription>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <span className="text-sm text-gray-500">5 min read</span>
        <Button variant="ghost" size="sm" className="text-primary">
          Read more <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Featured article component
function FeaturedArticle() {
  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-primary-900 to-primary-800 text-white">
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80')] bg-cover bg-center"></div>
      <div className="relative p-8 md:p-12 flex flex-col h-full">
        <div className="flex items-center">
          <Heart className="h-6 w-6 mr-2 text-red-400" />
          <Badge className="bg-red-500/20 text-red-300 border-0">Featured Article</Badge>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mt-4 mb-2">Understanding Heart Health: Prevention and Early Signs</h2>
        <p className="text-gray-200 mb-6 max-w-2xl">
          Heart disease remains the leading cause of death globally. Learn about important preventive measures, 
          risk factors, and how to recognize early warning signs that could save your life.
        </p>
        <div className="mt-auto flex flex-wrap gap-3">
          <Button className="bg-white text-primary hover:bg-gray-100">
            Read Full Article
          </Button>
          <Button variant="outline" className="text-white border-white hover:bg-white/10">
            Save for Later
          </Button>
        </div>
      </div>
    </div>
  );
}

// Categories section component
function CategoriesSection({ activeCategory, onCategoryChange }: { 
  activeCategory: string | null; 
  onCategoryChange: (category: string | null) => void;
}) {
  const categories = [
    { name: "Preventive Care", icon: <Activity className="h-5 w-5" /> },
    { name: "Medications", icon: <Pill className="h-5 w-5" /> },
    { name: "Conditions", icon: <Thermometer className="h-5 w-5" /> },
    { name: "Treatments", icon: <Stethoscope className="h-5 w-5" /> },
    { name: "Fitness", icon: <Dumbbell className="h-5 w-5" /> },
    { name: "Nutrition", icon: <Apple className="h-5 w-5" /> },
    { name: "Mental Health", icon: <Zap className="h-5 w-5" /> },
    { name: "Pediatrics", icon: <Baby className="h-5 w-5" /> }
  ];

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        {activeCategory && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCategoryChange(null)}
          >
            Clear Filter
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const isActive = activeCategory === category.name;
          return (
            <button 
              key={index}
              onClick={() => onCategoryChange(category.name)}
              className={`flex flex-col items-center justify-center p-4 bg-white rounded-lg border ${
                isActive 
                  ? 'border-primary bg-primary-50 shadow-md' 
                  : 'border-gray-200 hover:border-primary hover:shadow-md'
              } transition-all`}
            >
              <div className={`w-12 h-12 rounded-full ${
                isActive ? 'bg-primary-100' : 'bg-primary-50'
              } flex items-center justify-center mb-3 text-primary`}>
                {category.icon}
              </div>
              <span className={`font-medium ${
                isActive ? 'text-primary' : 'text-gray-800'
              }`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Newsletter subscription component
function NewsletterSection() {
  return (
    <div className="mt-12 bg-gray-100 rounded-xl p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-2">Stay Informed with Health Updates</h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter to receive weekly health tips, new articles, and important medical updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Your email address" 
            className="px-4 py-2 border border-gray-300 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button className="whitespace-nowrap">
            Subscribe Now
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          By subscribing, you agree to our privacy policy and consent to receive health-related emails.
        </p>
      </div>
    </div>
  );
}

export default function HealthTopics() {
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Sample health topics data
  const healthTopics = [
    {
      title: "Diabetes Management Tips for Daily Life",
      description: "Practical advice for living well with diabetes, including blood sugar monitoring, nutrition guidelines, and exercise recommendations.",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
      tags: ["Diabetes", "Chronic Conditions", "Nutrition"],
      category: "Conditions",
      icon: Activity
    },
    {
      title: "Understanding Vaccines: Myths and Facts",
      description: "Clear explanations about how vaccines work, their safety profiles, and addressing common misconceptions about immunization.",
      image: "https://images.unsplash.com/photo-1632168046261-70d17c3db5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
      tags: ["Vaccines", "Prevention", "Public Health"],
      category: "Preventive Care",
      icon: Thermometer
    },
    {
      title: "Mental Health Basics: Recognizing Warning Signs",
      description: "Learn to identify early signs of mental health challenges in yourself and loved ones, and understand when to seek professional help.",
      image: "https://images.unsplash.com/photo-1623242372547-527e75865e42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
      tags: ["Mental Health", "Well-being", "Self-care"],
      category: "Mental Health",
      icon: Zap
    },
    {
      title: "Nutrition Fundamentals for Heart Health",
      description: "Evidence-based dietary approaches to support cardiovascular health, including food choices that can help reduce heart disease risk.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
      tags: ["Nutrition", "Heart Health", "Prevention"],
      category: "Nutrition",
      icon: Heart
    },
    {
      title: "Sleep Disorders: Causes and Treatments",
      description: "Comprehensive overview of common sleep problems, their impact on health, and effective approaches to improving sleep quality.",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
      tags: ["Sleep", "Wellness", "Mental Health"],
      category: "Treatments",
      icon: Stethoscope
    },
    {
      title: "Exercise for Seniors: Safe and Effective Options",
      description: "Age-appropriate fitness recommendations for older adults, focusing on mobility, strength, balance, and overall functional health.",
      image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=350&q=80",
      tags: ["Senior Health", "Exercise", "Wellness"],
      category: "Fitness",
      icon: Dumbbell
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Health Topics</h1>
            <p className="mt-2 text-gray-600 max-w-3xl">
              Expert-reviewed articles and resources to help you make informed decisions about your health and wellness.
            </p>
          </div>
          
          {/* Featured article */}
          <FeaturedArticle />
          
          {/* Browse by category */}
          <CategoriesSection 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />
          
          {/* Latest articles */}
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {activeCategory ? `${activeCategory} Articles` : 'Latest Health Articles'}
              </h2>
              <Button variant="outline">View All Articles</Button>
            </div>
            
            {/* Filter indicator */}
            {activeCategory && (
              <div className="mb-6 p-3 bg-primary-50 border border-primary-100 rounded-md">
                <p className="text-primary-700 flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  Showing articles in the <strong className="mx-1">{activeCategory}</strong> category.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthTopics
                .filter(topic => !activeCategory || topic.category === activeCategory)
                .map((topic, index) => (
                  <HealthTopicCard 
                    key={index}
                    title={topic.title}
                    description={topic.description}
                    image={topic.image}
                    tags={topic.tags}
                    icon={topic.icon}
                  />
                ))}
            </div>
            
            {/* No results message */}
            {activeCategory && healthTopics.filter(topic => topic.category === activeCategory).length === 0 && (
              <div className="text-center py-10">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No articles match the selected category. Try selecting a different category.
                </p>
              </div>
            )}
          </div>
          
          {/* Newsletter subscription */}
          <NewsletterSection />
          
          {/* Popular topics section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["COVID-19", "Chronic Pain", "Weight Management", "Women's Health", 
                "Men's Health", "Allergies", "Skin Conditions", "Stress Management"].map((topic, index) => (
                <Button key={index} variant="outline" className="justify-start">
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}