import { NextRequest, NextResponse } from 'next/server';
import { FIVESIM_API_KEY } from '@/lib/config';

const FIVESIM_BASE_URL = 'https://5sim.net/v1';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${FIVESIM_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${FIVESIM_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to 5Sim API:', error);
    return NextResponse.json({ error: 'Failed to fetch from 5Sim API' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    const response = await fetch(`${FIVESIM_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIVESIM_API_KEY}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying to 5Sim API:', error);
    return NextResponse.json({ error: 'Failed to fetch from 5Sim API' }, { status: 500 });
  }
}