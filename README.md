autwh
-------------------------------

[![Greenkeeper badge](https://badges.greenkeeper.io/syuilo/autwh.svg)](https://greenkeeper.io/)

[![][npm-badge]][npm-link]
[![][mit-badge]][mit]

A simple Twitter API authentication helper. forked from [flutter](https://github.com/gosquared/flutter)

## Install
``` shell
$ npm install autwh
```

## Usage
### With [Express](https://github.com/expressjs/express)

In this example, express-session is used, but **other methods are also possible.**

``` javascript
import autwh from 'autwh';
import * as express from 'express';
import * as session from 'express-session';

const twAuth = autwh({
	consumerKey: 'kyoppie',
	consumerSecret: 'yuppie',
	callbackUrl: 'https://my.app.example.com/twitter/callback'
});

const app = express();
app.use(session());

app.get('/twitter/connect', async (req, res) => {
	const ctx = await twAuth.begin();
	req.session.xtx = ctx;
	res.redirect(ctx.url);
});

// URL used in loginCallback above
app.get('/twitter/callback', async (req, res) => {
	const tokens = await twAuth.done(req.session.ctx, req.query.oauth_verifier);
	console.log(tokens);
	res.send('Authorized!');
});
```

## License
[MIT](LICENSE)

[npm-link]:  https://www.npmjs.com/package/autwh
[npm-badge]: https://img.shields.io/npm/v/autwh.svg?style=flat-square
[mit]:       http://opensource.org/licenses/MIT
[mit-badge]: https://img.shields.io/badge/license-MIT-444444.svg?style=flat-square
