import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'DOCUMENT_DATA_SOURCE',
    useFactory: async () => {
      const isTestEnv = process.env.NODE_ENV === 'test';
      const dataSourceConfig: DataSourceOptions = isTestEnv
      ? {
        type: 'mongodb',
        url: (await MongoMemoryServer.create()).getUri(),
        useUnifiedTopology: true,
        entities: [__dirname + '/../../core/**/*.entity.document{.ts,.js}'],
      }
      :{
        type: 'mongodb',
        host: process.env.DOCUMENT_DATABASE_HOST,
        port: parseInt(process.env.DOCUMENT_DATABASE_PORT),
        username: process.env.DOCUMENT_DATABASE_USERNAME,
        password: process.env.DOCUMENT_DATABASE_PASSWORD,
        database: process.env.DOCUMENT_DATABASE_DATABASE,
        authSource: 'admin',
        entities: [__dirname + '/../../core/**/*.entity.document{.ts,.js}'],
      };

      const dataSource = new DataSource(dataSourceConfig)
      return dataSource.initialize();
    },
  },
];
