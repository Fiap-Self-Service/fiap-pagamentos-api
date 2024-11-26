import { Injectable } from '@nestjs/common';
import { IntencaoPagamentoGateway } from '../gateways/intencaoPagamento-gateway';
import { CadastrarIntencaoPagamentoUseCase } from '../../use-cases/cadastrar-intencao-pagamento-use-case';
import { IntencaoPagamentoDTO } from '../../dto/intencaoPagamentoDTO';
import { IPagamentoClient } from '../../external/client/pagamento-client.interface';
import { CriarIntencaoPagamentoDTO } from '../../dto/criarIntencaoPagamentoDTO';

@Injectable()
export class CriarIntencaoPagamentoController {
  constructor(
    private readonly intencaoPagamentoGateway: IntencaoPagamentoGateway,
    private readonly pagamentoClient: IPagamentoClient,
    private readonly cadastrarIntencaoPagamentoPorIdUseCase: CadastrarIntencaoPagamentoUseCase
  ) {}

  async execute(criarIntencaoPagamentoDTO: CriarIntencaoPagamentoDTO): Promise<IntencaoPagamentoDTO> {
    const intencaoPagamento =
      await this.cadastrarIntencaoPagamentoPorIdUseCase.execute(
        this.intencaoPagamentoGateway,
        this.pagamentoClient,
        criarIntencaoPagamentoDTO.valor,
      );
    const adapterPresenter: IntencaoPagamentoDTO = { ...intencaoPagamento };

    return adapterPresenter;
  }
}
