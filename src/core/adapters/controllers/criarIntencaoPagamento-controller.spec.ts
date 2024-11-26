import { Test, TestingModule } from '@nestjs/testing';
import { CriarIntencaoPagamentoController } from './criarIntencaoPagamento-controller';
import { IntencaoPagamentoGateway } from '../gateways/intencaoPagamento-gateway';
import { CadastrarIntencaoPagamentoUseCase } from '../../use-cases/cadastrar-intencao-pagamento-use-case';
import { IntencaoPagamentoDTO } from '../../dto/intencaoPagamentoDTO';
import { CriarIntencaoPagamentoDTO } from '../../dto/criarIntencaoPagamentoDTO';
import { IPagamentoClient } from '../../external/client/pagamento-client.interface';

describe('CriarIntencaoPagamentoController', () => {
  let criarIntencaoPagamentoController: CriarIntencaoPagamentoController;
  let intencaoPagamentoGateway: IntencaoPagamentoGateway;
  let cadastrarIntencaoPagamentoUseCase: CadastrarIntencaoPagamentoUseCase;
  let pagamentoClient: IPagamentoClient;

  beforeEach(async () => {
    const mockIntencaoPagamentoGateway = {};
    const mockCadastrarIntencaoPagamentoUseCase = {
      execute: jest.fn(),
    };
    const mockPagamentoClient = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CriarIntencaoPagamentoController,
        {
          provide: IntencaoPagamentoGateway,
          useValue: mockIntencaoPagamentoGateway,
        },
        {
          provide: CadastrarIntencaoPagamentoUseCase,
          useValue: mockCadastrarIntencaoPagamentoUseCase,
        },
        {
          provide: IPagamentoClient,
          useValue: mockPagamentoClient,
        },
      ],
    }).compile();

    criarIntencaoPagamentoController = module.get<CriarIntencaoPagamentoController>(
      CriarIntencaoPagamentoController,
    );
    intencaoPagamentoGateway = module.get<IntencaoPagamentoGateway>(
      IntencaoPagamentoGateway,
    );
    cadastrarIntencaoPagamentoUseCase = module.get<CadastrarIntencaoPagamentoUseCase>(
      CadastrarIntencaoPagamentoUseCase,
    );
    pagamentoClient = module.get<IPagamentoClient>(IPagamentoClient);
  });

  describe('execute', () => {
    it('Deve chamar o CadastrarIntencaoPagamentoUseCase e retornar o IntencaoPagamentoDTO correto', async () => {
      const criarIntencaoPagamentoDTO: CriarIntencaoPagamentoDTO = {
        valor: 150.0,
      };

      const intencaoPagamentoDTO: IntencaoPagamentoDTO = {
        id: 'id',
        status: 'EM_ANALISE',
        dataCriacao: new Date(),
        dataFinalizacao: null,
        qrCode: 'qr-code',
        idExterno: 'id-externo',
        data: null,
      };

      (cadastrarIntencaoPagamentoUseCase.execute as jest.Mock).mockResolvedValue(
        intencaoPagamentoDTO,
      );

      const result = await criarIntencaoPagamentoController.execute(
        criarIntencaoPagamentoDTO,
      );

      expect(cadastrarIntencaoPagamentoUseCase.execute).toHaveBeenCalledWith(
        intencaoPagamentoGateway,
        pagamentoClient,
        criarIntencaoPagamentoDTO.valor,
      );

      expect(result).toEqual(intencaoPagamentoDTO);
    });
  });
});
