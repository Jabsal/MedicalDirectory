import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import SubscriptionForm from './SubscriptionForm';
import { useQuery } from "@tanstack/react-query";
import type { Subscription } from '@shared/schema';

interface SubscribeButtonProps {
  userId?: number;
  subscriptionType: 'specialty' | 'hospital' | 'topic';
  entityId: number;
  entityName: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export default function SubscribeButton({ 
  userId = 1, // Default user ID for demo purposes
  subscriptionType,
  entityId,
  entityName,
  variant = 'default',
  size = 'default',
  className
}: SubscribeButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Check if user is already subscribed
  const { data: userSubscriptions, isLoading } = useQuery<Subscription[]>({
    queryKey: [`/api/subscriptions/user/${userId}`],
    enabled: !!userId,
  });
  
  useEffect(() => {
    if (userSubscriptions) {
      // Check if user is already subscribed to this entity
      const existingSubscription = userSubscriptions.find(
        sub => sub.subscriptionType === subscriptionType && sub.entityId === entityId
      );
      setIsSubscribed(!!existingSubscription);
    }
  }, [userSubscriptions, subscriptionType, entityId]);
  
  const handleSubscribe = () => {
    if (isSubscribed) {
      // Already subscribed, do nothing
      return;
    }
    
    setIsDialogOpen(true);
  };
  
  const handleSubscriptionSuccess = () => {
    setIsDialogOpen(false);
    setIsSubscribed(true);
  };

  return (
    <>
      <Button
        variant={isSubscribed ? 'outline' : variant}
        size={size}
        onClick={handleSubscribe}
        className={className}
        disabled={isLoading}
      >
        {isSubscribed ? (
          <>
            <Check className="h-4 w-4 mr-2" />
            Subscribed
          </>
        ) : (
          <>
            <Bell className="h-4 w-4 mr-2" />
            Subscribe
          </>
        )}
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to Updates</DialogTitle>
          </DialogHeader>
          <SubscriptionForm
            userId={userId}
            subscriptionType={subscriptionType}
            entityId={entityId}
            entityName={entityName}
            onSuccess={handleSubscriptionSuccess}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}