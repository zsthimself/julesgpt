"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserDataSync() {
  const { isSignedIn, isLoaded } = useUser();
  const [syncAttempts, setSyncAttempts] = useState(0);
  
  useEffect(() => {
    // Sync user data when user is loaded and signed in
    if (isLoaded && isSignedIn) {
      syncUserData();
    }
  }, [isLoaded, isSignedIn, syncAttempts]);
  
  // Retry sync after delay
  const retrySyncAfterDelay = (delayMs = 5000) => {
    console.log(`Will retry user sync in ${delayMs/1000} seconds...`);
    setTimeout(() => {
      setSyncAttempts(prev => prev + 1);
    }, delayMs);
  };
  
  // Sync user data to Supabase
  const syncUserData = async () => {
    try {
      console.log('Attempting to sync user data...');
      
      const response = await fetch('/sync-user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Check if response is successful
      if (!response.ok) {
        console.error('Failed to sync user data:', response.statusText);
        
        // Don't retry on 401 (not authenticated) or 403 (forbidden)
        if (response.status !== 401 && response.status !== 403) {
          retrySyncAfterDelay();
        }
        return;
      }
      
      // Check response content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Failed to sync user data: Server did not return JSON');
        retrySyncAfterDelay();
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
        retrySyncAfterDelay();
        return;
      }
      
      if (!data.success) {
        console.error('User data sync failed:', data.message || 'Unknown error');
        if (data.error) {
          console.error('Error details:', data.error);
        }
        
        // Retry for certain types of errors
        if (data.message?.includes('table') || 
            data.message?.includes('UUID') || 
            data.message?.includes('permission')) {
          retrySyncAfterDelay(10000); // Longer delay for infrastructure issues
        }
      } else {
        console.log('User data sync successful');
      }
    } catch (error) {
      console.error('Error during sync request:', error);
      retrySyncAfterDelay();
    }
  };
  
  // This component doesn't render any content
  return null;
} 