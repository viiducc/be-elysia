import { t } from 'elysia';

export const signupUserRequestSchema = {
  body: t.Object({
    email: t.String({ format: 'email' }),
    password: t.String({ minLength: 8 }),
  }),
};

export const resendVerificationLinkRequestSchema = {
  body: t.Object({
    email: t.String({ format: 'email' }),
  }),
};

const jwtPayload = t.Object({
  alg: t.String({ format: 'jwt-alg' }),
  email: t.String({ format: 'email' }),
});

export const loginUserRequestSchema = {
  body: t.Object({
    username: t.String({ format: 'email' }),
    password: t.String(),
  }),
  jwt: t.Object({
    sign: t.Function(
      [
        t.Object({
          payload: t.Any(),
        }),
      ],
      t.String(),
    ),
    verify: t.Function([t.String()], t.Any()),
  }),
};

export const verifyUserEmailRequestSchema = {
  query: t.Object({
    token: t.String(),
  }),
};

export const verifyTokenRequestSchema = {
  headers: t.Object({
    authorization: t.TemplateLiteral('Bearer ${string}'),
  }),
  jwt: t.Any(),
};

// export const verifyTokenRequestSchema = {
//   headers: t
//     .Object({
//       authorization: t.TemplateLiteral('Bearer ${string}'),
//     })
//     .optional(),
//   cookies: t.Object({
//     auth_token: t
//       .String({
//         format: 'jwt',
//       })
//       .optional(),
//   }),
// };
