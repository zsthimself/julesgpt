import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

// This function manually syncs Clerk user data to Supabase after login
export async function syncUserToSupabase() {
  try {
    // Get current Clerk user
    const user = await currentUser();
    
    if (!user) {
      console.error('No logged in user found');
      return { success: false, message: 'No logged in user found' };
    }

    // Check Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Attempting to sync user to Supabase:', { 
      userId: user.id,
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey 
    });

    if (!supabaseUrl || !supabaseAnonKey || 
        supabaseUrl === 'your_supabase_url_here' || 
        supabaseAnonKey === 'your_supabase_anon_key_here') {
      console.warn('Supabase environment variables not configured, skipping user sync');
      return { success: false, message: 'Supabase environment variables not configured' };
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Check if the users table exists
    const { error: tableCheckError, count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
      
    if (tableCheckError) {
      console.error('Error checking users table:', tableCheckError);
      return { 
        success: false, 
        message: 'Failed to verify users table exists', 
        error: tableCheckError.message 
      };
    }

    console.log('Users table verification successful');

    // Prepare user data
    const userData = {
      clerk_id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      username: user.username || user.emailAddresses[0]?.emailAddress?.split('@')[0],
      first_name: user.firstName,
      last_name: user.lastName,
      avatar_url: user.imageUrl,
      updated_at: new Date().toISOString(),
    };

    console.log('Prepared user data for sync:', { 
      clerk_id: userData.clerk_id,
      email: userData.email,
      username: userData.username
    });

    // Save user data to Supabase
    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'clerk_id' });

    if (error) {
      console.error('Failed to sync user data to Supabase:', error);
      return { success: false, message: 'Database error while syncing user', error: error.message };
    }

    console.log('User data successfully synced to Supabase');
    return { success: true, message: 'User data synced to Supabase' };
  } catch (error) {
    console.error('Error syncing user data:', error);
    return { success: false, message: 'Exception while syncing user', error: String(error) };
  }
} 