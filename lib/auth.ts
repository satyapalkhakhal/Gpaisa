// Edge-safe only — must never import bcryptjs, so middleware's edge bundle stays clean.
// Password comparison is isolated to app/api/admin/login/route.ts (Node runtime).
import { SignJWT, jwtVerify } from 'jose';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const JWT_ALG = 'HS256';
const SESSION_DURATION = '7d';

function getSecretKey() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('[AUTH] JWT_SECRET is not set');
    return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
    sub: string;
    role: 'admin';
}

export async function signAdminSession(username: string): Promise<string> {
    return new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: JWT_ALG })
        .setSubject(username)
        .setIssuedAt()
        .setExpirationTime(SESSION_DURATION)
        .sign(getSecretKey());
}

export async function verifyAdminSession(token: string): Promise<AdminSessionPayload | null> {
    try {
        const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: [JWT_ALG] });
        if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null;
        return { sub: payload.sub, role: 'admin' };
    } catch {
        return null;
    }
}
