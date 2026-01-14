import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Ambil data pengguna dari cookie
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get('current_user');

    if (!userDataCookie) {
      return NextResponse.json({
        loggedIn: false,
        message: 'No user data found in cookies'
      });
    }

    let userData;
    try {
      userData = JSON.parse(userDataCookie.value || '{}');
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
      return NextResponse.json({
        loggedIn: false,
        message: 'Error parsing user data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return NextResponse.json({
      loggedIn: true,
      userData: userData
    });
  } catch (error) {
    console.error('Error checking user session:', error);
    return NextResponse.json({
      loggedIn: false,
      message: 'Error checking session',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}