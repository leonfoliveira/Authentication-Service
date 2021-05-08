/* eslint-disable import/order */
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
/* eslint-enable import/order */

dotenv.config();
moduleAlias.addAlias('@', `${__dirname}/../`);

/* eslint-disable import/first */
import 'reflect-metadata';
import { createConnection } from 'typeorm';

import app from './config/app';
import env from './config/env';
/* eslint-enable import/first */

/* eslint-disable no-console */
createConnection(env.typeormConnection as any)
  .then(() => {
    app.listen(env.port, () =>
      console.log(`Authentication-Service: Listening on port ${env.port}.`),
    );
  })
  .catch((error) => {
    console.error(`Authentication-Service: ${error}.`);
  });
/* eslint-enable no-console */
