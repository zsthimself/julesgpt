"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserDataSync() {
  const { isSignedIn, isLoaded } = useUser();
  
  useEffect(() => {
    // Sync user data when user is loaded and signed in
    if (isLoaded && isSignedIn) {
      syncUserData();
    }
  }, [isLoaded, isSignedIn]);
  
  // Sync user data to Supabase
  const syncUserData = async () => {
    try {
      const response = await fetch('/sync-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Check if response is successful
      if (!response.ok) {
        console.error('Failed to sync user data:', response.statusText);
        return;
      }
      
      // Check response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Failed to sync user data: Server did not return JSON');
        return;
      }
      
      // Safely parse JSON
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse server response:', e);
        console.error('Raw response content:', text);
        return;
      }
      
      if (!data.success) {
        console.error('User data sync failed:', data.message || 'Unknown error');
        if (data.error) {
          console.error('Error details:', data.error);
        }
      } else {
        console.log('User data sync successful');
      }
    } catch (error) {
      console.error('Error during sync request:', error);
    }
  };
  
  // This component doesn't render any content
  return null;
} 