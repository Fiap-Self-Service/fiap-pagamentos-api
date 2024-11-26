import { Test, TestingModule } from '@nestjs/testing';
import { IntencaoPagamentoGateway } from './intencaoPagamento-gateway';
import { IIntencaoPagamentoRepository } from '../../external/repository/intencaoPagamento-repository.interface';
import { IntencaoPagamento } from '../../entities/intencaoPagamento';
import { AtualizarIntencaoPagamentoDTO } from '../../dto/atualizarIntencaoPagamentoDTO';

describe('IntencaoPagamentoGateway', () => {
  let intencaoPagamentoGateway: IntencaoPagamentoGateway;
  let intencaoPagamentoRepository: IIntencaoPagamentoRepository;

  beforeEach(async () => {
    const mockIntencaoPagamentoRepository = {
      salvarPagamento: jest.fn(),
      buscarPorIdPagamento: jest.fn(),
      atualizarStatusPagamento: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntencaoPagamentoGateway,
        {
          provide: IIntencaoPagamentoRepository,
          useValue: mockIntencaoPagamentoRepository,
        },
      ],
    }).compile();

    intencaoPagamentoGateway = module.get<IntencaoPagamentoGateway>(
      IntencaoPagamentoGateway,
    );
    intencaoPagamentoRepository = module.get<IIntencaoPagamentoRepository>(
      IIntencaoPagamentoRepository,
    );
  });

  describe('salvarIntencaoPagamento', () => {
    it('Deve chamar o método salvarPagamento do repositório e retornar a intenção de pagamento', async () => {
      const pagamentoMock: IntencaoPagamento = new IntencaoPagamento();
      pagamentoMock.id = '123';
      pagamentoMock.status = 'PENDENTE';

      (
        intencaoPagamentoRepository.salvarPagamento as jest.Mock
      ).mockResolvedValue(pagamentoMock);

      const result =
        await intencaoPagamentoGateway.salvarIntencaoPagamento(pagamentoMock);

      expect(intencaoPagamentoRepository.salvarPagamento).toHaveBeenCalledWith(
        pagamentoMock,
      );

      expect(result).toEqual(pagamentoMock);
    });
  });

  describe('buscarPorIdIntencaoPagamento', () => {
    it('Deve chamar o método buscarPorIdPagamento do repositório e retornar a intenção de pagamento', async () => {
      const id = '123';
      const pagamentoMock: IntencaoPagamento = new IntencaoPagamento();
      pagamentoMock.id = id;

      (
        intencaoPagamentoRepository.buscarPorIdPagamento as jest.Mock
      ).mockResolvedValue(pagamentoMock);

      const result =
        await intencaoPagamentoGateway.buscarPorIdIntencaoPagamento(id);

      expect(
        intencaoPagamentoRepository.buscarPorIdPagamento,
      ).toHaveBeenCalledWith(id);

      expect(result).toEqual(pagamentoMock);
    });

    it('Deve retornar null se a intenção de pagamento não for encontrada', async () => {
      const id = '123';

      (
        intencaoPagamentoRepository.buscarPorIdPagamento as jest.Mock
      ).mockResolvedValue(null);

      const result =
        await intencaoPagamentoGateway.buscarPorIdIntencaoPagamento(id);

      expect(
        intencaoPagamentoRepository.buscarPorIdPagamento,
      ).toHaveBeenCalledWith(id);

      expect(result).toBeNull();
    });
  });

  describe('atualizarStatusIntencaoPagamento', () => {
    it('Deve chamar o método atualizarStatusPagamento do repositório e retornar a intenção de pagamento atualizada', async () => {
      const id = '123';
      const atualizarDTO: AtualizarIntencaoPagamentoDTO = {
        status: 'FINALIZADO',
        dataFinalizacao: new Date(),
      };
      const pagamentoMock: IntencaoPagamento = new IntencaoPagamento();
      pagamentoMock.id = id;
      pagamentoMock.status = 'FINALIZADO';

      (
        intencaoPagamentoRepository.atualizarStatusPagamento as jest.Mock
      ).mockResolvedValue(pagamentoMock);

      const result =
        await intencaoPagamentoGateway.atualizarStatusIntencaoPagamento(
          id,
          atualizarDTO,
        );

      expect(
        intencaoPagamentoRepository.atualizarStatusPagamento,
      ).toHaveBeenCalledWith(id, atualizarDTO);

      expect(result).toEqual(pagamentoMock);
    });
  });
});
