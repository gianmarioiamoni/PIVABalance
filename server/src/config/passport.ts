import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User, IUser } from '../models/User';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('Missing Google OAuth credentials in environment variables');
  throw new Error('Missing Google OAuth credentials');
}

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile:', profile);
        
        if (!profile.emails?.[0]?.value) {
          console.error('No email found in Google profile');
          return done(new Error('No email found in Google profile'));
        }

        // Check if user already exists
        let user = await User.findOne({ 
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value }
          ]
        });

        if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
          });
          console.log('Created new user:', user);
        } else if (!user.googleId) {
          // If user exists but doesn't have googleId (email signup), add googleId
          user.googleId = profile.id;
          await user.save();
          console.log('Updated existing user with googleId:', user);
        } else {
          console.log('Found existing user:', user);
        }

        return done(null, user);
      } catch (error) {
        console.error('Google Strategy Error:', error);
        return done(error as Error);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.error('Deserialize User Error:', error);
    done(error);
  }
});

export default passport;
