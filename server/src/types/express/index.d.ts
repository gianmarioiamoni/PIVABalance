import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    oauthState: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        oauthState?: string;
      }
      user?: {
        userId: string;
      };
      token?: string;
    }
  }
}
