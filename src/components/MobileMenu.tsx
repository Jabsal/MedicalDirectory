import { useState } from "react";
import { Link } from "wouter";
import { 
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, Home, Hospital, UserPlus, Heart, Calendar, HelpCircle, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className="p-1 text-white focus:outline-none">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-background p-0">
        <SheetHeader className="h-16 px-4 flex items-center justify-center border-b border-border bg-primary">
          <SheetTitle className="text-xl font-bold text-primary-foreground flex items-center">
            <div className="bg-primary-foreground/20 p-2 rounded-lg mr-3">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent font-extrabold">
              MediFind
            </span>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <SheetClose asChild>
            <Link href="/" className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary">
              <Home className="mr-3 h-5 w-5" />
              Home
            </Link>
          </SheetClose>

          <SheetClose asChild>
            <Link href="/symptom-chat" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <MessageCircle className="mr-3 h-5 w-5" />
              Symptom Chat
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/health-dashboard" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Heart className="mr-3 h-5 w-5" />
              Health Dashboard
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/health-topics" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Heart className="mr-3 h-5 w-5" />
              Health Topics
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link href="/appointments" className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Calendar className="mr-3 h-5 w-5" />
              Appointments
            </Link>
          </SheetClose>
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <SheetClose asChild>
              <Link href="/faqs" className="flex items-center text-sm font-medium text-primary">
                <HelpCircle className="mr-2 h-5 w-5" />
                FAQs & Help
              </Link>
            </SheetClose>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
