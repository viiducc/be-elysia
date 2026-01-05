import { Elysia, t } from 'elysia';
import { ServerError } from '@/src/shared/errors/error';
import { ErrorCodes } from '@/src/shared/errors/error-codes.enum';

export const authMiddleware = (verifyUrl: string) =>
  new Elysia({
    name: 'oauth2-middleware',
  })
    .guard({
      headers: t.Object({
        authorization: t.TemplateLiteral('Bearer ${string}'),
      }),
      cookies: t.Object({
        auth_token: t.String({ format: 'jwt' }).optional(),
      }),
    })
    .macro({
      auth(enabled: boolean) {
        if (!enabled) return;

        return {
          async resolve({ headers: { authorization }, cookie: { auth_token } }) {
            // Prefer cookie over header token
            let token: string;
            if (auth_token) {
              token = String(auth_token);
            } else {
              token = authorization?.split(' ')[1] ?? '';
            }

            if (!token) {
              throw new ServerError(403, ErrorCodes.FORBIDDEN, 'Forbidden');
            }

            const user = await verifyToken(token, verifyUrl);
            if (!user) {
              throw new ServerError(403, ErrorCodes.FORBIDDEN, 'Forbidden');
            }

            return { user };
          },
        };
      },
    });

async function verifyToken(token: string, verifyUrl: string) {
  const decoded = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!decoded.ok) {
    throw new ServerError(403, ErrorCodes.FORBIDDEN, 'Forbidden');
  }

  return decoded.json();
}
