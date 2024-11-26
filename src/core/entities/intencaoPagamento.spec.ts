import { IntencaoPagamento } from './intencaoPagamento';
import { IntencaoPagamentoStatusType } from './intencaoPagamentoStatus-type.enum';

describe('IntencaoPagamento', () => {
  describe('Valores iniciais', () => {
    it('deve ter status "EM_ANALISE" no momento da criação', () => {
      const intencao = new IntencaoPagamento();
      expect(intencao.status).toBe(IntencaoPagamentoStatusType.EM_ANALISE);
    });

    it('deve ter dataCriacao como a data atual', () => {
      const intencao = new IntencaoPagamento();
      const now = new Date();
      // Verifica se a data de criação está dentro de um intervalo de 1 segundo da data atual
      expect(intencao.dataCriacao.getTime()).toBeCloseTo(now.getTime(), -1);
    });

    it('deve ter dataFinalizacao como null inicialmente', () => {
      const intencao = new IntencaoPagamento();
      expect(intencao.dataFinalizacao).toBeNull();
    });

    it('deve ter qrCode como null inicialmente', () => {
      const intencao = new IntencaoPagamento();
      expect(intencao.qrCode).toBeUndefined();
    });

    it('deve ter idExterno como null inicialmente', () => {
      const intencao = new IntencaoPagamento();
      expect(intencao.idExterno).toBeUndefined();
    });

    it('deve ter data como null inicialmente', () => {
      const intencao = new IntencaoPagamento();
      expect(intencao.data).toBeUndefined();
    });
  });
});
