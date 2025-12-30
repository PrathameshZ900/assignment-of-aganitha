// app/api/pastes/[id]/route.js
import { NextResponse } from 'next/server';
import { getPaste } from '@/lib/pastes';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // getPaste handles expiry and view counting logic
    const data = await getPaste(id, request);

    if (!data) {
      return NextResponse.json({ error: 'Paste not found or unavailable' }, { status: 404 });
    }

    // Format Response
    let remaining_views = null;
    if (data.max_views) {
      remaining_views = Math.max(0, data.max_views - data.current_views);
    }
    
    const expires_at_iso = data.expires_at ? new Date(data.expires_at).toISOString() : null;

    return NextResponse.json({
      content: data.content,
      remaining_views,
      expires_at: expires_at_iso
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch paste error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
