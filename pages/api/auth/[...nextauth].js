import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

// Basic runtime checks to help debug deployment issues (do not log secrets)
const { NEXTAUTH_URL, NEXTAUTH_SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
console.log('NextAuth runtime check - NEXTAUTH_URL:', NEXTAUTH_URL);
console.log('NextAuth runtime check - NEXTAUTH_SECRET set:', !!NEXTAUTH_SECRET);
console.log('NextAuth runtime check - SPOTIFY_CLIENT_ID set:', !!SPOTIFY_CLIENT_ID);
console.log('NextAuth runtime check - SPOTIFY_CLIENT_SECRET set:', !!SPOTIFY_CLIENT_SECRET);
if (NEXTAUTH_URL && NEXTAUTH_URL.includes('accounts.spotify.com')) {
  console.error('Misconfigured NEXTAUTH_URL: it points to accounts.spotify.com. Set NEXTAUTH_URL to your app URL, e.g. https://your-app.com');
}

async function refreshAccessToken(token){
  try{
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const {body: refreshedToken} = await spotifyApi.refreshAccessToken();
    console.log("refreshed token is" , refreshedToken);

    return{
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires : Date.now() + refreshedToken.expires_in * 1000, // 1 hour as 3600 returns from spotify API
      refreshToken : refreshedToken.refresh_token ?? token.refreshToken,
    }

  }catch(error){
    console.log(error)
    return {
      ...token,
      error : "RefreshAccessTokenError"
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret : process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({token, account, user}){
      //initial sign in
      if(account && user){
        return{
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      //Return previous token if the access token has not expired yet
      if(Date.now() < token.accessTokenExpires){
        return token; 
      }
      //Access token has expired , so we need to refresh it
      console.log("Access token has expired, refreshing..");
      return await refreshAccessToken(token)
    },

    async session ({session, token}){
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username =token.username;

      return session;
    }
  },
});