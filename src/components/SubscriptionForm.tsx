import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertSubscriptionSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell } from 'lucide-react';

// Define a simpler form schema, more forgiving than the database schema
const formSchema = z.object({
  userId: z.number(),
  email: z.string().email('Please provide a valid email address'),
  subscriptionType: z.string(),
  entityId: z.number(),
  entityName: z.string(),
  active: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

interface SubscriptionFormProps {
  userId: number;
  subscriptionType: 'specialty' | 'hospital' | 'topic';
  entityId: number;
  entityName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SubscriptionForm({
  userId,
  subscriptionType,
  entityId,
  entityName,
  onSuccess,
  onCancel
}: SubscriptionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId,
      email: '',
      subscriptionType,
      entityId,
      entityName,
      active: true
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      console.log('Submitting subscription:', data);
      
      await apiRequest('POST', '/api/subscriptions', data);
      
      // Invalidate any related queries to refresh subscription data
      queryClient.invalidateQueries({ queryKey: [`/api/subscriptions/user/${userId}`] });
      
      toast({
        title: 'Subscription successful!',
        description: `You've subscribed to updates for ${entityName}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Subscription failed',
        description: 'There was a problem with your subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-medium">Get updates about {entityName}</h3>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" type="email" {...field} />
                </FormControl>
                <FormDescription>
                  We'll send you updates about {entityName}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 mt-6">
            {onCancel && (
              <Button variant="outline" onClick={onCancel} type="button">
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}