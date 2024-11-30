import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { AtualizarIntencaoPagamentoDTO } from '../../core/dto/atualizarIntencaoPagamentoDTO';
import { IntencaoPagamentoStatusType } from '../../core/entities/intencaoPagamentoStatus-type.enum';
import { ObjectId } from 'mongodb';
import { CriarIntencaoPagamentoDTO } from '../../core/dto/criarIntencaoPagamentoDTO';
const nock = require('nock');

let app: INestApplication;
let response: any;
let idIntencao: ObjectId;
let criarIntencaoPagamentoDTO: CriarIntencaoPagamentoDTO;
let atualizarIntencaoPagamentoDTO: AtualizarIntencaoPagamentoDTO;

Before(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
});

After(async () => {
  await app.close();
});

Given('cadastro de intenção de pagamento', async () => {
  criarIntencaoPagamentoDTO = {
    valor: 100,
  };
});

Given('que seja informado um ID já cadastrado', async () => {
  idIntencao = (
    await request(app.getHttpServer())
      .post('/pagamentos')
      .send(criarIntencaoPagamentoDTO)
  ).body.id;
});

Given('que seja informado um ID não cadastrado', async () => {
  idIntencao = new ObjectId();
});

When('realizado o cadastro de intenção de pagamento', async () => {
  response = await request(app.getHttpServer())
    .post('/pagamentos')
    .send(criarIntencaoPagamentoDTO);
});

When('realizado a busca do Intenção de Pagamento por ID', async () => {
  nock('http://fiap-pedidos-api.com')
  .patch('/pedidos/webhook/pagamento/'+ idIntencao, {'status': 'PREPARACAO'})
  .reply(200, { status: 'PREPARACAO' });
  
  response = await request(app.getHttpServer())
    .get('/pagamentos/' + idIntencao)
    .send();
});

When('realizado a atualização de Intenção de Pagamento por ID', async () => {
  atualizarIntencaoPagamentoDTO = {
    status: IntencaoPagamentoStatusType.FINALIZADO,
    dataFinalizacao: new Date(),
  };

  nock('http://fiap-pedidos-api.com')
  .patch('/pedidos/webhook/pagamento/'+ idIntencao, {'status': 'PREPARACAO'})
  .reply(200, { status: 'PREPARACAO' });

  response = await request(app.getHttpServer())
    .post('/pagamentos/webhook/' + idIntencao)
    .send(atualizarIntencaoPagamentoDTO);
});

Then('a intenção de pagamento deve ser cadastrada', async () => {
  assert.equal(response.status, HttpStatus.CREATED);
  assert.equal(response.body.status, IntencaoPagamentoStatusType.EM_ANALISE);
});

Then(
  'os dados da Intenção de Pagamento cadastrada devem ser retornados',
  async () => {
    assert.equal(response.status, HttpStatus.OK);
    assert.equal(response.body.status, IntencaoPagamentoStatusType.EM_ANALISE);
  },
);

Then(
  'deve retornar que a Intenção de Pagamento não foi encontrada',
  async () => {
    assert.equal(response.status, HttpStatus.NOT_FOUND);
  },
);

Then(
  'os dados da Intenção de Pagamento cadastrada atualizados devem ser retornados',
  async () => {
    assert.equal(response.status, HttpStatus.OK);
    assert.equal(response.body.status, IntencaoPagamentoStatusType.FINALIZADO);
  },
);

Then(
  'uma exceção informando que o Intenção de Pagamento não foi encontrada deve ser lançada',
  async () => {
    assert.equal(response.status, HttpStatus.BAD_REQUEST);
  },
);
