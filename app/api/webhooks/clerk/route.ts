import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 从环境变量获取Clerk webhook密钥
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('请设置CLERK_WEBHOOK_SECRET环境变量');
    return new Response('Webhook密钥未配置', { status: 500 });
  }

  // 获取请求头和body
  const headersList = headers();
  const svix_id = headersList.get('svix-id') || '';
  const svix_timestamp = headersList.get('svix-timestamp') || '';
  const svix_signature = headersList.get('svix-signature') || '';

  // 如果缺少必要的头信息，返回错误
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('缺少svix头信息', { status: 400 });
  }

  // 获取请求体
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // 使用svix验证webhook有效性
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

  // 从事件中获取数据
  const { id } = evt.data;
  const eventType = evt.type;

  // 创建Supabase客户端
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

  // 处理不同类型的事件
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

    // 使用upsert操作保存到Supabase
    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'clerk_id' });

    if (error) {
      console.error('保存用户数据到Supabase失败:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '用户数据已同步到Supabase' });
  }

  if (eventType === 'user.deleted') {
    // 当Clerk中删除用户时，从Supabase中也删除对应用户
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', id);

    if (error) {
      console.error('从Supabase删除用户失败:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '用户已从Supabase删除' });
  }

  // 对于其他事件类型，返回成功
  return NextResponse.json({ success: true, message: '事件已接收' });
} 