import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'DOCUMENT_DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mongodb',
        host: process.env.DOCUMENT_DATABASE_HOST,
        port: parseInt(process.env.DOCUMENT_DATABASE_PORT),
        username: process.env.DOCUMENT_DATABASE_USERNAME,
        password: process.env.DOCUMENT_DATABASE_PASSWORD,
        database: process.env.DOCUMENT_DATABASE_DATABASE,
        authSource: 'admin',
        entities: [__dirname + '/../../core/**/*.entity.document{.ts,.js}'],
      });

      return dataSource.initialize();
    },
  },
];
