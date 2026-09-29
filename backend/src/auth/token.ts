import jwt from 'jsonwebtoken';

const issuer = 'bitfrost-api';
const audience = 'bitfrost-web';
export const tokenLifetimeSeconds = 15 * 60;

export function authSecret(): string {
  const value = process.env.JWT_SECRET;
  if (!value || Buffer.byteLength(value) < 32) {
    throw new Error('Configure JWT_SECRET com pelo menos 32 bytes aleatórios.');
  }
  return value;
}

export function issueToken(id: string): string {
  return jwt.sign({}, authSecret(), {
    algorithm: 'HS256', subject: id, issuer, audience, expiresIn: tokenLifetimeSeconds,
  });
}

export function tokenSubject(token: string): string {
  const claims = jwt.verify(token, authSecret(), {
    algorithms: ['HS256'], issuer, audience, maxAge: tokenLifetimeSeconds,
  });
  if (typeof claims === 'string' || typeof claims.sub !== 'string' || !claims.sub
      || typeof claims.exp !== 'number') throw new Error('Token inválido.');
  return claims.sub;
}
