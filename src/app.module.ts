import { Module } from '@nestjs/common';
import { PagamentosAPIController } from './core/external/api/pagamento-api.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AtualizarStatusIntencaoPagamentoUseCase } from './core/use-cases/atualizar-intencao-pagamento-use-case';
import { ConsultarIntencaoPagamentoPorIdUseCase } from './core/use-cases/consultar-intencao-pagamento-use-case';
import { ConsultarIntencaoPagamentoPorIdController } from './core/adapters/controllers/consultarIntencaoPagamento-controller';
import { AtualizarStatusIntencaoPagamentoController } from './core/adapters/controllers/atualizarIntencaoPagamento-controller';
import { IntencaoPagamentoGateway } from './core/adapters/gateways/intencaoPagamento-gateway';
import { DataSource } from 'typeorm';
import { IntencaoPagamentoEntity } from './core/external/repository/intencaoPagamento.entity.document';
import { IIntencaoPagamentoRepository } from './core/external/repository/intencaoPagamento-repository.interface';
import { IntencaoRepository } from './core/external/repository/intencaoPagamento-repository';
import { CadastrarIntencaoPagamentoUseCase } from './core/use-cases/cadastrar-intencao-pagamento-use-case';
import { HttpModule } from '@nestjs/axios';
import { IPagamentoClient } from './core/external/client/pagamento-client.interface';
import { PagamentoMockClient } from './core/external/client/pagamentoMock-client';
import { CriarIntencaoPagamentoController } from './core/adapters/controllers/criarIntencaoPagamento-controller';

@Module({
  providers: [
    // use cases
    AtualizarStatusIntencaoPagamentoUseCase,
    ConsultarIntencaoPagamentoPorIdUseCase,
    CadastrarIntencaoPagamentoUseCase,

    // controllers
    AtualizarStatusIntencaoPagamentoController,
    ConsultarIntencaoPagamentoPorIdController,
    CriarIntencaoPagamentoController,

    //gateways
    IntencaoPagamentoGateway,

    //clients
    {
      provide: IPagamentoClient,
      useClass: PagamentoMockClient,
    },

    //repository
    {
      provide: IIntencaoPagamentoRepository,
      useClass: IntencaoRepository,
    },
    {
      provide: 'INTENCAO_PAGAMENTO_REPOSITORY',
      useFactory: (datasource: DataSource) =>
        datasource.getRepository(IntencaoPagamentoEntity),
      inject: ['DOCUMENT_DATA_SOURCE'],
    },
  ],
  controllers: [PagamentosAPIController],
  imports: [DatabaseModule, HttpModule],
  exports: [IntencaoPagamentoGateway],
})
export class AppModule {}
