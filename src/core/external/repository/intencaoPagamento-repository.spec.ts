import { Test, TestingModule } from '@nestjs/testing';
import { IntencaoRepository } from './intencaoPagamento-repository';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { IntencaoPagamentoEntity } from './intencaoPagamento.entity.document';
import { AtualizarIntencaoPagamentoDTO } from '../../dto/atualizarIntencaoPagamentoDTO';
import { IntencaoPagamento } from '../../entities/intencaoPagamento';

describe('IntencaoRepository', () => {
  let repository: IntencaoRepository;

  const mockMongoRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntencaoRepository,
        {
          provide: 'INTENCAO_PAGAMENTO_REPOSITORY',
          useValue: mockMongoRepository,
        },
      ],
    }).compile();

    repository = module.get<IntencaoRepository>(IntencaoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('atualizarStatusPagamento', () => {
    it('deve atualizar o status de uma intenção de pagamento existente', async () => {
      const id = new ObjectId();
      const mockEntity: IntencaoPagamentoEntity = {
        id: id,
        status: 'PENDENTE',
      } as IntencaoPagamentoEntity;

      const atualizarDTO: AtualizarIntencaoPagamentoDTO = {
        status: 'FINALIZADO',
        dataFinalizacao: new Date(),
      };

      mockMongoRepository.findOneBy.mockResolvedValue(mockEntity);
      mockMongoRepository.save.mockResolvedValue({
        ...mockEntity,
        ...atualizarDTO,
      });

      const resultado = await repository.atualizarStatusPagamento(
        id.toString(),
        atualizarDTO,
      );

      expect(mockMongoRepository.findOneBy).toHaveBeenCalledWith({
        _id: new ObjectId(id),
      });
      expect(mockMongoRepository.save).toHaveBeenCalledWith({
        ...mockEntity,
        ...atualizarDTO,
      });
      expect(resultado).toEqual({
        ...mockEntity,
        ...atualizarDTO,
      });
    });
  });

  describe('buscarPorIdPagamento', () => {
    it('deve retornar a intenção de pagamento quando encontrada', async () => {
      const id = new ObjectId().toString();
      const mockEntity: IntencaoPagamentoEntity = {
        id: new ObjectId(id),
        status: 'PENDENTE',
        dataCriacao: new Date(),
        dataFinalizacao: new Date(),
        qrCode: 'qrcode',
        idExterno: 'id-externo',
        data: null,
      };

      mockMongoRepository.findOneBy.mockResolvedValue(mockEntity);

      const resultado = await repository.buscarPorIdPagamento(id);

      expect(mockMongoRepository.findOneBy).toHaveBeenCalledWith({
        _id: new ObjectId(id),
      });
      expect(resultado).toEqual(mockEntity);
    });

    it('deve retornar null se a intenção de pagamento não for encontrada', async () => {
      const id = new ObjectId().toString();

      mockMongoRepository.findOneBy.mockResolvedValue(null);

      const resultado = await repository.buscarPorIdPagamento(id);

      expect(mockMongoRepository.findOneBy).toHaveBeenCalledWith({
        _id: new ObjectId(id),
      });
      expect(resultado).toBeNull();
    });
  });

  describe('salvarPagamento', () => {
    it('deve salvar uma nova intenção de pagamento', async () => {
      const pagamento: IntencaoPagamento = {
        status: 'PENDENTE',
      } as IntencaoPagamento;

      await repository.salvarPagamento(pagamento);

      expect(mockMongoRepository.save).toHaveBeenCalledWith(pagamento);
    });
  });
});
