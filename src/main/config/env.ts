export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  domain: process.env.DOMAIN || 'localhost',
  host: process.env.HOST || 'http://localhost:4000',
  port: process.env.PORT || 4000,
  bcryptRounds: 12,
  jwtSecret: process.env.SECRET,
  jwtRefreshTokenExpiration: +process.env.JWT_REFRESH_TOKEN_EXPIRATION || 60 * 60 * 24 * 7,
  nodemailerOptions: {
    host: process.env.MAIL_HOST || 'smtp.mailtrap.io',
    port: process.env.MAIL_PORT || 2525,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  nodemailerSender: process.env.SENDER || 'no-reply@ecomerce.com',
  typeormConnection: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'auth',
    synchronize: true,
    logging: false,
    entities: [
      `${__dirname}/../../infra/entities/**/*.ts`,
      `${__dirname}/../../infra/entities/**/*.js`,
    ],
  },
};
