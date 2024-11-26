import { Test, TestingModule } from '@nestjs/testing';
import { PagamentosAPIController } from './pagamento-api.controller';
import { AtualizarStatusIntencaoPagamentoController } from '../../adapters/controllers/atualizarIntencaoPagamento-controller';
import { ConsultarIntencaoPagamentoPorIdController } from '../../adapters/controllers/consultarIntencaoPagamento-controller';
import { CriarIntencaoPagamentoController } from '../../adapters/controllers/criarIntencaoPagamento-controller';
import { AtualizarIntencaoPagamentoDTO } from '../../dto/atualizarIntencaoPagamentoDTO';
import { CriarIntencaoPagamentoDTO } from '../../dto/criarIntencaoPagamentoDTO';
import { IntencaoPagamentoDTO } from '../../dto/intencaoPagamentoDTO';
import { ObjectId } from 'typeorm';

describe('PagamentosAPIController', () => {
  let pagamentosAPIController: PagamentosAPIController;
  let atualizarStatusIntencaoPagamentoController: AtualizarStatusIntencaoPagamentoController;
  let consultarIntencaoPagamentoPorIdController: ConsultarIntencaoPagamentoPorIdController;
  let criarIntencaoPagamentoController: CriarIntencaoPagamentoController;

  beforeEach(async () => {
    const mockAtualizarStatusIntencaoPagamentoController = {
      execute: jest.fn(),
    };

    const mockConsultarIntencaoPagamentoPorIdController = {
      execute: jest.fn(),
    };

    const mockCriarIntencaoPagamentoController = {
      execute: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PagamentosAPIController],
      providers: [
        {
          provide: AtualizarStatusIntencaoPagamentoController,
          useValue: mockAtualizarStatusIntencaoPagamentoController,
        },
        {
          provide: ConsultarIntencaoPagamentoPorIdController,
          useValue: mockConsultarIntencaoPagamentoPorIdController,
        },
        {
          provide: CriarIntencaoPagamentoController,
          useValue: mockCriarIntencaoPagamentoController,
        },
      ],
    }).compile();

    pagamentosAPIController = moduleRef.get(PagamentosAPIController);
    atualizarStatusIntencaoPagamentoController = moduleRef.get(
      AtualizarStatusIntencaoPagamentoController,
    );
    consultarIntencaoPagamentoPorIdController = moduleRef.get(
      ConsultarIntencaoPagamentoPorIdController,
    );
    criarIntencaoPagamentoController = moduleRef.get(
      CriarIntencaoPagamentoController,
    );
  });

  describe('atualizarStatusIntencaoPagamento', () => {
    it('Deve atualizar o status da intenção de pagamento com sucesso', async () => {
      const id = '123';
      const date = new Date();
      const atualizarStatusDTO: AtualizarIntencaoPagamentoDTO = {
        status: 'FINALIZADO',
        dataFinalizacao: null,
      };

      const resultadoMock: IntencaoPagamentoDTO = {
        id: id,
        status: 'EM_ANALISE',
        dataCriacao: date,
        dataFinalizacao: date,
        qrCode: 'qr-code',
        idExterno: 'id-externo',
        data: null,
      };

      jest
        .spyOn(atualizarStatusIntencaoPagamentoController, 'execute')
        .mockImplementation(async () => resultadoMock);

      const resultado =
        await pagamentosAPIController.atualizarStatusIntencaoPagamento(
          id,
          atualizarStatusDTO,
        );

      expect(resultado).toBe(resultadoMock);
      expect(
        atualizarStatusIntencaoPagamentoController.execute,
      ).toHaveBeenCalledWith(id, atualizarStatusDTO);
    });
  });

  describe('criarIntencaoPagamento', () => {
    it('Deve criar uma nova intenção de pagamento', async () => {
      const criarDTO: CriarIntencaoPagamentoDTO = {
        valor: 100.0,
      };

      const resultadoMock: IntencaoPagamentoDTO = {
        id: '123',
        status: 'EM_ANALISE',
        dataCriacao: new Date(),
        dataFinalizacao: null,
        idExterno: 'id-externo',
        qrCode: 'qr-code',
        data: null,
      };

      jest
        .spyOn(criarIntencaoPagamentoController, 'execute')
        .mockImplementation(async () => resultadoMock);

      const resultado =
        await pagamentosAPIController.criarIntencaoPagamento(criarDTO);

      expect(resultado).toBe(resultadoMock);
      expect(criarIntencaoPagamentoController.execute).toHaveBeenCalledWith(
        criarDTO,
      );
    });
  });

  describe('consultarPedidoPorId', () => {
    it('Deve consultar uma intenção de pagamento por ID', async () => {
      let id = '123';
      const resultadoMock: IntencaoPagamentoDTO = {
        id: id,
        status: 'EM_ANALISE',
        dataCriacao: new Date(),
        dataFinalizacao: null,
        idExterno: 'id-externo',
        qrCode: 'qr-code',
        data: null,
      };

      jest
        .spyOn(consultarIntencaoPagamentoPorIdController, 'execute')
        .mockImplementation(async () => resultadoMock);

      const resultado = await pagamentosAPIController.consultarPedidoPorId(id);

      expect(resultado).toBe(resultadoMock);
      expect(
        consultarIntencaoPagamentoPorIdController.execute,
      ).toHaveBeenCalledWith(id);
    });
  });
});
