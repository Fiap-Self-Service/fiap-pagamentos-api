import { Test, TestingModule } from '@nestjs/testing';
import { CadastrarIntencaoPagamentoUseCase } from './cadastrar-intencao-pagamento-use-case';
import { IntencaoPagamentoGateway } from '../adapters/gateways/intencaoPagamento-gateway';
import { IntencaoPagamento } from '../entities/intencaoPagamento';
import { IPagamentoClient } from '../external/client/pagamento-client.interface';
import { PagamentoParceiroDTO } from '../dto/pagamentoParceiroDTO';

describe('CadastrarIntencaoPagamentoUseCase', () => {
  let useCase: CadastrarIntencaoPagamentoUseCase;
  let intencaoGateway: IntencaoPagamentoGateway;
  let pagamentoClient: IPagamentoClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadastrarIntencaoPagamentoUseCase,
        {
          provide: IntencaoPagamentoGateway,
          useValue: {
            salvarIntencaoPagamento: jest.fn(),
          },
        },
        {
          provide: IPagamentoClient,
          useValue: {
            gerarPagamentoParceiro: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<CadastrarIntencaoPagamentoUseCase>(
      CadastrarIntencaoPagamentoUseCase,
    );
    intencaoGateway = module.get<IntencaoPagamentoGateway>(
      IntencaoPagamentoGateway,
    );
    pagamentoClient = module.get<IPagamentoClient>(IPagamentoClient);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve salvar uma nova IntencaoPagamento e associar informações de pagamento do parceiro', async () => {
      let date = new Date();
      const mockIntencaoPagamento: IntencaoPagamento = {
        id: '123',
        status: 'EM_ANALISE',
        dataCriacao: date,
        dataFinalizacao: null,
        qrCode: null,
        idExterno: null,
        data: null,
      };
      const mockPagamentoParceiro: PagamentoParceiroDTO = {
        qrCode: 'qrcode-mock',
        id: 'pagamento-parceiro-123',
        creationDate: date,
        externalReference: '123',
        amount: 100,
        description: 'Pagamento Mock',
      };
      const valor = 100;

      jest
        .spyOn(intencaoGateway, 'salvarIntencaoPagamento')
        .mockResolvedValueOnce(mockIntencaoPagamento)
        .mockResolvedValueOnce({
          ...mockIntencaoPagamento,
          qrCode: mockPagamentoParceiro.qrCode,
          idExterno: mockPagamentoParceiro.id,
        });

      jest
        .spyOn(pagamentoClient, 'gerarPagamentoParceiro')
        .mockResolvedValue(mockPagamentoParceiro);

      const resultado = await useCase.execute(
        intencaoGateway,
        pagamentoClient,
        valor,
      );

      expect(intencaoGateway.salvarIntencaoPagamento).toHaveBeenCalledTimes(2);

      /*expect(intencaoGateway.salvarIntencaoPagamento).toHaveBeenCalledWith(1, {
        status: 'EM_ANALISE',
        dataCriacao: date,
        dataFinalizacao: null,
      });
      expect(intencaoGateway.salvarIntencaoPagamento).toHaveBeenCalledWith(2, {
        ...mockIntencaoPagamento,
        qrCode: mockPagamentoParceiro.qrCode,
        idExterno: mockPagamentoParceiro.id,
      });*/

      expect(pagamentoClient.gerarPagamentoParceiro).toHaveBeenCalledWith({
        creationDate: mockIntencaoPagamento.dataCriacao,
        externalReference: mockIntencaoPagamento.id,
        amount: valor,
        description: 'Pagamento Mock',
      });

      expect(resultado).toEqual({
        ...mockIntencaoPagamento,
        qrCode: mockPagamentoParceiro.qrCode,
        idExterno: mockPagamentoParceiro.id,
      });
    });

    it('deve lançar um erro se o método salvarIntencaoPagamento falhar', async () => {
      jest
        .spyOn(intencaoGateway, 'salvarIntencaoPagamento')
        .mockRejectedValue(new Error('Erro ao salvar a intenção'));

      await expect(
        useCase.execute(intencaoGateway, pagamentoClient, 100.0),
      ).rejects.toThrow('Erro ao salvar a intenção');
    });

    it('deve lançar um erro se o método gerarPagamentoParceiro falhar', async () => {
      const mockIntencaoPagamento: IntencaoPagamento = {
        id: '123',
        status: 'EM_ANALISE',
        dataCriacao: new Date(),
        dataFinalizacao: null,
        qrCode: null,
        idExterno: null,
        data: null,
      };

      jest
        .spyOn(intencaoGateway, 'salvarIntencaoPagamento')
        .mockResolvedValue(mockIntencaoPagamento);
      jest
        .spyOn(pagamentoClient, 'gerarPagamentoParceiro')
        .mockRejectedValue(new Error('Erro ao gerar pagamento'));

      await expect(
        useCase.execute(intencaoGateway, pagamentoClient, 100.0),
      ).rejects.toThrow('Erro ao gerar pagamento');
    });
  });
});
