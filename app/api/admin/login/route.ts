import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const { username, password } = await request.json().catch(() => ({}));
    if (!username || !password) {
        return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
    }

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
    if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) {
        console.error('[ADMIN_LOGIN] Missing ADMIN_USERNAME/ADMIN_PASSWORD_HASH env vars');
        return NextResponse.json({ error: 'Server is not configured for login.' }, { status: 500 });
    }

    // Always run bcrypt.compare against the real hash regardless of username match,
    // so a wrong-username attempt takes the same time as a wrong-password one.
    const usernameMatches = username === ADMIN_USERNAME;
    const passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!usernameMatches || !passwordMatches) {
        return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const token = await signAdminSession(username);
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
    return res;
}
