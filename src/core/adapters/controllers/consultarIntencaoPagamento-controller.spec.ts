import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarIntencaoPagamentoPorIdController } from './consultarIntencaoPagamento-controller';
import { IntencaoPagamentoGateway } from '../gateways/intencaoPagamento-gateway';
import { ConsultarIntencaoPagamentoPorIdUseCase } from '../../use-cases/consultar-intencao-pagamento-use-case';
import { IntencaoPagamentoDTO } from '../../dto/intencaoPagamentoDTO';

describe('ConsultarIntencaoPagamentoPorIdController', () => {
  let consultarIntencaoPagamentoPorIdController: ConsultarIntencaoPagamentoPorIdController;
  let intencaoPagamentoGateway: IntencaoPagamentoGateway;
  let consultarIntencaoPagamentoPorIdUseCase: ConsultarIntencaoPagamentoPorIdUseCase;

  beforeEach(async () => {
    const mockIntencaoPagamentoGateway = {};
    const mockConsultarIntencaoPagamentoPorIdUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarIntencaoPagamentoPorIdController,
        {
          provide: IntencaoPagamentoGateway,
          useValue: mockIntencaoPagamentoGateway,
        },
        {
          provide: ConsultarIntencaoPagamentoPorIdUseCase,
          useValue: mockConsultarIntencaoPagamentoPorIdUseCase,
        },
      ],
    }).compile();

    consultarIntencaoPagamentoPorIdController =
      module.get<ConsultarIntencaoPagamentoPorIdController>(
        ConsultarIntencaoPagamentoPorIdController,
      );
    intencaoPagamentoGateway = module.get<IntencaoPagamentoGateway>(
      IntencaoPagamentoGateway,
    );
    consultarIntencaoPagamentoPorIdUseCase =
      module.get<ConsultarIntencaoPagamentoPorIdUseCase>(
        ConsultarIntencaoPagamentoPorIdUseCase,
      );
  });

  describe('execute', () => {
    it('Deve chamar o ConsultarIntencaoPagamentoPorIdUseCase e retornar o IntencaoPagamentoDTO correto', async () => {
      const idIntencaoPagamento = 'intencao-id';
      const intencaoPagamentoDTO = new IntencaoPagamentoDTO();
      intencaoPagamentoDTO.id = idIntencaoPagamento;
      intencaoPagamentoDTO.status = 'EM_ANALISE';
      intencaoPagamentoDTO.dataCriacao = new Date();
      intencaoPagamentoDTO.dataFinalizacao = null;
      intencaoPagamentoDTO.qrCode = 'qr-code';
      intencaoPagamentoDTO.idExterno = 'id-externo';
      intencaoPagamentoDTO.data = null;
      (
        consultarIntencaoPagamentoPorIdUseCase.execute as jest.Mock
      ).mockResolvedValue(intencaoPagamentoDTO);

      const result =
        await consultarIntencaoPagamentoPorIdController.execute(
          idIntencaoPagamento,
        );

      expect(
        consultarIntencaoPagamentoPorIdUseCase.execute,
      ).toHaveBeenCalledWith(intencaoPagamentoGateway, idIntencaoPagamento);

      expect(result).toEqual(intencaoPagamentoDTO);
    });
  });
});
