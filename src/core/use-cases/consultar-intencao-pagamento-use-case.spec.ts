import { Test, TestingModule } from '@nestjs/testing';
import { ConsultarIntencaoPagamentoPorIdUseCase } from './consultar-intencao-pagamento-use-case';
import { IntencaoPagamentoGateway } from '../adapters/gateways/intencaoPagamento-gateway';
import { IntencaoPagamento } from '../entities/intencaoPagamento';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ConsultarIntencaoPagamentoPorIdUseCase', () => {
  let useCase: ConsultarIntencaoPagamentoPorIdUseCase;
  let intencaoGateway: IntencaoPagamentoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultarIntencaoPagamentoPorIdUseCase,
        {
          provide: IntencaoPagamentoGateway,
          useValue: {
            buscarPorIdIntencaoPagamento: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ConsultarIntencaoPagamentoPorIdUseCase>(ConsultarIntencaoPagamentoPorIdUseCase);
    intencaoGateway = module.get<IntencaoPagamentoGateway>(IntencaoPagamentoGateway);
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve retornar a IntencaoPagamento quando encontrada', async () => {
        let date = new Date();
        const idIntencaoPagamento = '123';
        const mockIntencaoPagamento: IntencaoPagamento = {
          id: idIntencaoPagamento,
          status: 'EM_ANALISE',
          dataCriacao: date,
          dataFinalizacao: null,
          qrCode: null,
          idExterno: null,
          data: null,
        };

      jest.spyOn(intencaoGateway, 'buscarPorIdIntencaoPagamento').mockResolvedValue(mockIntencaoPagamento);

      const resultado = await useCase.execute(intencaoGateway, idIntencaoPagamento);

      expect(resultado).toEqual(mockIntencaoPagamento);
      expect(intencaoGateway.buscarPorIdIntencaoPagamento).toHaveBeenCalledWith(idIntencaoPagamento);
    });

    it('deve lançar HttpException quando a IntencaoPagamento não for encontrada', async () => {
      const idIntencaoPagamento = '123';

      jest.spyOn(intencaoGateway, 'buscarPorIdIntencaoPagamento').mockResolvedValue(null);

      await expect(useCase.execute(intencaoGateway, idIntencaoPagamento)).rejects.toThrowError(
        new HttpException(
          'IntencaoPagamento não encontrada, verifique a intenção que foi passado.',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(intencaoGateway.buscarPorIdIntencaoPagamento).toHaveBeenCalledWith(idIntencaoPagamento);
    });
  });
});
