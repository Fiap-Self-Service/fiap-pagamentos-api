import { Test, TestingModule } from '@nestjs/testing';
import { AtualizarStatusIntencaoPagamentoUseCase } from './atualizar-intencao-pagamento-use-case';
import { IntencaoPagamentoGateway } from '../adapters/gateways/intencaoPagamento-gateway';
import { AtualizarIntencaoPagamentoDTO } from '../dto/atualizarIntencaoPagamentoDTO';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IntencaoPagamento } from '../entities/intencaoPagamento';
import { fiapPedidosApiClient } from '../external/client/fiap-pedidos-api.client';

jest.mock('../external/client/fiap-pedidos-api.client');

describe('AtualizarStatusIntencaoPagamentoUseCase', () => {
  let useCase: AtualizarStatusIntencaoPagamentoUseCase;
  let intencaoPagamentoGateway: IntencaoPagamentoGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AtualizarStatusIntencaoPagamentoUseCase,
        {
          provide: IntencaoPagamentoGateway,
          useValue: {
            buscarPorIdIntencaoPagamento: jest.fn(),
            atualizarStatusIntencaoPagamento: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<AtualizarStatusIntencaoPagamentoUseCase>(
      AtualizarStatusIntencaoPagamentoUseCase,
    );
    intencaoPagamentoGateway = module.get<IntencaoPagamentoGateway>(
      IntencaoPagamentoGateway,
    );
  });

  it('deve estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('deve lançar HttpException se a IntencaoPagamento não for encontrada', async () => {
      jest
        .spyOn(intencaoPagamentoGateway, 'buscarPorIdIntencaoPagamento')
        .mockResolvedValue(null);

      await expect(
        useCase.execute(
          intencaoPagamentoGateway,
          '123',
          new AtualizarIntencaoPagamentoDTO(),
        ),
      ).rejects.toThrow(
        new HttpException(
          'IntencaoPagamento não encontrada.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('deve retornar a IntencaoPagamento atualizada em caso de sucesso', async () => {
      const mockIntencaoPagamento: IntencaoPagamento = {
        id: '123',
        status: 'PENDENTE',
        dataCriacao: new Date(),
        dataFinalizacao: new Date(),
        qrCode: 'qr',
        idExterno: '321',
        data: null,
      };
      const mockAtualizarIntencaoPagamentoDTO =
        new AtualizarIntencaoPagamentoDTO();
      mockAtualizarIntencaoPagamentoDTO.status = 'FINALIZADO';

      jest
        .spyOn(intencaoPagamentoGateway, 'buscarPorIdIntencaoPagamento')
        .mockResolvedValue(mockIntencaoPagamento);
      jest
        .spyOn(intencaoPagamentoGateway, 'atualizarStatusIntencaoPagamento')
        .mockResolvedValue({
          ...mockIntencaoPagamento,
          status: mockAtualizarIntencaoPagamentoDTO.status,
          dataFinalizacao: new Date(),
        });
      jest.spyOn(fiapPedidosApiClient, 'atualizarStatusPedido').mockResolvedValue({
        status: HttpStatus.CREATED,
      });

      const resultado = await useCase.execute(
        intencaoPagamentoGateway,
        '123',
        mockAtualizarIntencaoPagamentoDTO,
      );

      expect(resultado).toHaveProperty(
        'status',
        mockAtualizarIntencaoPagamentoDTO.status,
      );
      expect(resultado).toHaveProperty('dataFinalizacao');
    });

    it('deve lançar HttpException se não for possível atualizar o status no serviço externo', async () => {
      const mockIntencaoPagamento: IntencaoPagamento = {
        id: '123',
        status: 'PENDENTE',
        dataCriacao: new Date(),
        dataFinalizacao: new Date(),
        qrCode: 'qr',
        idExterno: '321',
        data: null,
      };
      const mockAtualizarIntencaoPagamentoDTO =
        new AtualizarIntencaoPagamentoDTO();
      mockAtualizarIntencaoPagamentoDTO.status = 'FINALIZADO';

      jest
        .spyOn(intencaoPagamentoGateway, 'buscarPorIdIntencaoPagamento')
        .mockResolvedValue(mockIntencaoPagamento);
      jest
        .spyOn(intencaoPagamentoGateway, 'atualizarStatusIntencaoPagamento')
        .mockResolvedValue({
          ...mockIntencaoPagamento,
          status: mockAtualizarIntencaoPagamentoDTO.status,
          dataFinalizacao: new Date(),
        });
      jest.spyOn(fiapPedidosApiClient, 'atualizarStatusPedido').mockResolvedValue({
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(
        useCase.execute(
          intencaoPagamentoGateway,
          '123',
          mockAtualizarIntencaoPagamentoDTO,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Falha ao atualizar IntencaoPagamento. Revise os dados enviados e tente novamente.',
          HttpStatus.BAD_GATEWAY,
        ),
      );
    });
  });
});
