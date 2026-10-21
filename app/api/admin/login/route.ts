import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminSession, ADMIN_SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

interface AdminCredential {
    username: string;
    passwordHash: string;
}

// Primary admin from ADMIN_USERNAME/ADMIN_PASSWORD_HASH, plus optional extra admins from
// ADMIN_EXTRA_USERS: comma-separated "username:bcrypt-hash" pairs. bcrypt hashes contain
// neither ":" nor ",", so the split is unambiguous.
function adminCredentials(primaryUsername: string, primaryHash: string): AdminCredential[] {
    const extras = (process.env.ADMIN_EXTRA_USERS || '')
        .split(',')
        .map((pair) => pair.trim())
        .filter(Boolean)
        .map((pair) => {
            const idx = pair.lastIndexOf(':');
            return { username: pair.slice(0, idx).trim(), passwordHash: pair.slice(idx + 1).trim() };
        })
        .filter((c) => c.username && c.passwordHash.startsWith('$2'));
    return [{ username: primaryUsername, passwordHash: primaryHash }, ...extras];
}

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

    // Always run exactly one bcrypt.compare — against the primary hash when the username
    // is unknown — so a wrong-username attempt takes the same time as a wrong-password one.
    const match = adminCredentials(ADMIN_USERNAME, ADMIN_PASSWORD_HASH).find((c) => c.username === username);
    const passwordMatches = await bcrypt.compare(password, match?.passwordHash ?? ADMIN_PASSWORD_HASH);
    if (!match || !passwordMatches) {
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
