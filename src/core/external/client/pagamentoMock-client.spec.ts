import { PagamentoMockClient } from './pagamentoMock-client';
import { CriarPagamentoParceiroDTO } from '../../dto/criarPagamentoParceiroDTO';
import { PagamentoParceiroDTO } from '../../dto/pagamentoParceiroDTO';
import * as QRCode from 'qrcode';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('PagamentoMockClient', () => {
  let client: PagamentoMockClient;

  beforeEach(() => {
    client = new PagamentoMockClient();
    (QRCode.toDataURL as jest.Mock).mockResolvedValue('mockQRCodeData');
  });

  it('deve gerar um pagamento e um código QR', async () => {
    const data: CriarPagamentoParceiroDTO = {
      creationDate: new Date(),
      externalReference: 'ref123',
      amount: 100.00,
      description: 'Pagamento de teste',
    };

    const resultado: PagamentoParceiroDTO = await client.gerarPagamentoParceiro(data);

    expect(resultado.id).toBeDefined();
    expect(resultado.creationDate).toBe(data.creationDate);
    expect(resultado.externalReference).toBe(data.externalReference);
    expect(resultado.amount).toBe(data.amount);
    expect(resultado.description).toBe(data.description);
    expect(resultado.qrCode).toBe('mockQRCodeData');
  });
});
