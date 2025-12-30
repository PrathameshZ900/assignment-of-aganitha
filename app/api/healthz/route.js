import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET() {
  try {
    // Check if persistence layer is responsive (Redis or Memory)
    await store.ping();
    
    // Return 200 OK
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    // If even memory store fails (unlikely), return 500
    return NextResponse.json({ ok: false, error: 'Persistence layer unreachable' }, { status: 500 });
  }
}
