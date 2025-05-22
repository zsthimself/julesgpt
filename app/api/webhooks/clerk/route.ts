import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Get Clerk webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('Please set CLERK_WEBHOOK_SECRET environment variable');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get headers and body from request
  const headersList = await headers();
  const svix_id = headersList.get('svix-id') || '';
  const svix_timestamp = headersList.get('svix-timestamp') || '';
  const svix_signature = headersList.get('svix-signature') || '';

  // Return error if required headers are missing
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get request body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook validity using svix
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // Get data from event
  const { id } = evt.data;
  const eventType = evt.type;

  // Create Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() { return undefined },
        set() { return },
        remove() { return },
      },
    }
  );

  // Handle different types of events
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id: clerk_id, email_addresses, username, first_name, last_name, image_url } = evt.data;
    
    const email = email_addresses?.[0]?.email_address;
    const avatar_url = image_url;

    const userData = {
      clerk_id,
      email,
      username,
      first_name,
      last_name,
      avatar_url,
      updated_at: new Date().toISOString(),
    };

    // Use upsert operation to save to Supabase
    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'clerk_id' });

    if (error) {
      console.error('Failed to save user data to Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User data synced to Supabase' });
  }

  if (eventType === 'user.deleted') {
    // When a user is deleted in Clerk, also delete them from Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', id);

    if (error) {
      console.error('Failed to delete user from Supabase:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User deleted from Supabase' });
  }

  // For other event types, return success
  return NextResponse.json({ success: true, message: 'Event received' });
} 