import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

const nock = require('nock');

const Intencao = {
  valor: 100,
};

const atualizarIntencao = {
  status: 'FINALIZADO',
};

describe('Testes de Integração', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Deve cadastrar uma Intenção de Pagamento', () => {
    return request(app.getHttpServer())
      .post('/pagamentos')
      .send(Intencao)
      .expect(HttpStatus.CREATED);
  });

  it('Deve buscar os dados de uma Intenção de Pagamento por ID', async () => {
    let intencaoId = (
      await request(app.getHttpServer()).post('/pagamentos').send(Intencao)
    ).body.id;

    return await request(app.getHttpServer())
      .get('/pagamentos/' + intencaoId)
      .send()
      .expect(HttpStatus.OK);
  });

  it('Deve atualizar uma Intenção de Pagamento', async () => {
    let intencaoId = (
      await request(app.getHttpServer()).post('/pagamentos').send(Intencao)
    ).body.id;

    expect(intencaoId).toBeDefined()
    
    nock('http://fiap-pedidos-api.com')
      .patch('/pedidos/webhook/pagamento/'+ intencaoId, {'status': 'PREPARACAO'})
      .reply(200, { status: 'PREPARACAO' });

    return await request(app.getHttpServer())
      .post('/pagamentos/webhook/' + intencaoId)
      .send(atualizarIntencao)
      .expect(HttpStatus.OK);
  });
});
