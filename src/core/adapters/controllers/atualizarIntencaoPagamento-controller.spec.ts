import { Test, TestingModule } from '@nestjs/testing';
import { AtualizarStatusIntencaoPagamentoController } from './atualizarIntencaoPagamento-controller';
import { IntencaoPagamentoGateway } from '../gateways/intencaoPagamento-gateway';
import { AtualizarStatusIntencaoPagamentoUseCase } from '../../use-cases/atualizar-intencao-pagamento-use-case';
import { AtualizarIntencaoPagamentoDTO } from '../../dto/atualizarIntencaoPagamentoDTO';
import { IntencaoPagamentoDTO } from '../../dto/intencaoPagamentoDTO';

describe('AtualizarStatusIntencaoPagamentoController', () => {
  let atualizarStatusIntencaoPagamentoController: AtualizarStatusIntencaoPagamentoController;
  let intencaoPagamentoGateway: IntencaoPagamentoGateway;
  let atualizarStatusIntencaoPagamentoUseCase: AtualizarStatusIntencaoPagamentoUseCase;

  beforeEach(async () => {
    const mockIntencaoPagamentoGateway = {};
    const mockAtualizarStatusIntencaoPagamentoUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtualizarStatusIntencaoPagamentoController,
        {
          provide: IntencaoPagamentoGateway,
          useValue: mockIntencaoPagamentoGateway,
        },
        {
          provide: AtualizarStatusIntencaoPagamentoUseCase,
          useValue: mockAtualizarStatusIntencaoPagamentoUseCase,
        },
      ],
    }).compile();

    atualizarStatusIntencaoPagamentoController =
      module.get<AtualizarStatusIntencaoPagamentoController>(
        AtualizarStatusIntencaoPagamentoController,
      );
    intencaoPagamentoGateway = module.get<IntencaoPagamentoGateway>(
      IntencaoPagamentoGateway,
    );
    atualizarStatusIntencaoPagamentoUseCase =
      module.get<AtualizarStatusIntencaoPagamentoUseCase>(
        AtualizarStatusIntencaoPagamentoUseCase,
      );
  });

  describe('execute', () => {
    it('Deve chamar o AtualizarStatusIntencaoPagamentoUseCase e retornar o IntencaoPagamentoDTO correto', async () => {
      const id = 'intencao-id';
      const atualizarIntencaoPagamentoDTO: AtualizarIntencaoPagamentoDTO = {
        status: 'FINALIZADO',
        dataFinalizacao: null,
      };

      const intencaoPagamentoDTO: IntencaoPagamentoDTO = {
        id: id,
        status: 'FINALIZADO',
        dataCriacao: new Date(),
        dataFinalizacao: new Date(),
        qrCode: 'qr-code',
        idExterno: 'id-externo',
        data: null,
      };

      (
        atualizarStatusIntencaoPagamentoUseCase.execute as jest.Mock
      ).mockResolvedValue(intencaoPagamentoDTO);

      const result = await atualizarStatusIntencaoPagamentoController.execute(
        id,
        atualizarIntencaoPagamentoDTO,
      );

      expect(
        atualizarStatusIntencaoPagamentoUseCase.execute,
      ).toHaveBeenCalledWith(
        intencaoPagamentoGateway,
        id,
        atualizarIntencaoPagamentoDTO,
      );

      expect(result).toEqual(intencaoPagamentoDTO);
    });
  });
});
