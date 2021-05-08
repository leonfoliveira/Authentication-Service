import app from './config/app';
import env from './config/env';

// eslint-disable-next-line no-console
app.listen(env.port, () => console.log(`Authentication-Service: Listening on port ${env.port}.`));
