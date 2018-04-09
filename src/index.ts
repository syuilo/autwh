const OAuth = require('oauth').OAuth;

export interface Options {
	/**
	 * Your app's consumer key
	 */
	consumerKey: string;

	/**
	 * Your app's consumer secret
	 */
	consumerSecret: string;

	/**
	 * The URL to redirect to after Twitter authorisation
	 */
	callbackUrl?: string;
}

export type SessionContext = {
	/**
	 * Request token
	 */
	requestToken: string;

	/**
	 * Request token secret
	 */
	requestTokenSecret: string;
}

export default function(opts: Options) {
	const oauth = new OAuth(
		'https://twitter.com/oauth/request_token',
		'https://twitter.com/oauth/access_token',
		opts.consumerKey,
		opts.consumerSecret,
		'1.0A',
		opts.callbackUrl,
		'HMAC-SHA1'
	);

	const begin = () => new Promise<SessionContext & {
		/**
		 * The URL that authenticate form
		 */
		url: string;
	}>((resolve, reject) => {
		oauth.getOAuthRequestToken((err, token, secret) => {
			if (err) { // on error getting request tokens
				return reject(err);
			}

			// got oauth request tokens
			resolve({
				requestToken: token,
				requestTokenSecret: secret,

				// sign in the user if the user has previously connected, else ask for authorization.
				// see https://dev.twitter.com/oauth/reference/get/oauth/authenticate
				url: `https://twitter.com/oauth/authenticate?oauth_token=${token}`
			});
		});
	});

	const done = (ctx: SessionContext, verifier: string) => new Promise<{
		/**
		 * User's access token
		 */
		accessToken: string;

		/**
		 * User's access token secret
		 */
		accessTokenSecret: string;

		/**
		 * User's ID
		 */
		userId: string;

		/**
		 * User's screen name
		 */
		screenName: string;
	}>((resolve, reject) => {
		oauth.getOAuthAccessToken(ctx.requestToken, ctx.requestTokenSecret, verifier, (err, token, secret, res) => {
			if (err) { // on error getting access tokens
				return reject(err);
			}

			// got oauth access tokens
			resolve({
				accessToken: token,
				accessTokenSecret: secret,
				userId: res.user_id,
				screenName: res.screen_name
			});
		});
	});

	return {
		begin,
		done
	};
}
