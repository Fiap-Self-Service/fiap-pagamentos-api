import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IntencaoPagamentoGateway } from '../adapters/gateways/intencaoPagamento-gateway';
import { AtualizarIntencaoPagamentoDTO } from '../dto/atualizarIntencaoPagamentoDTO';
import { IntencaoPagamento } from '../entities/intencaoPagamento';
import { fiapPedidosApiClient } from '../external/client/fiap-pedidos-api.client';

@Injectable()
export class AtualizarStatusIntencaoPagamentoUseCase {
  async execute(
    intencaoPagamentoGateway: IntencaoPagamentoGateway,
    id: string,
    atualizarStatusIntencaoPagamentoDTO: AtualizarIntencaoPagamentoDTO,
  ): Promise<IntencaoPagamento> {
    const intencaoPagamento =
      await intencaoPagamentoGateway.buscarPorIdIntencaoPagamento(id);

    if (!intencaoPagamento) {
      throw new HttpException(
        'IntencaoPagamento não encontrada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      atualizarStatusIntencaoPagamentoDTO.dataFinalizacao = new Date();
      const result =
        await intencaoPagamentoGateway.atualizarStatusIntencaoPagamento(
          id,
          atualizarStatusIntencaoPagamentoDTO,
        );

      const pedidosFiapResult = await fiapPedidosApiClient.atualizarStatusPedido(id, atualizarStatusIntencaoPagamentoDTO.status)
      if (pedidosFiapResult.status !== HttpStatus.CREATED) {
        throw new HttpException(
          'Não foi possível atualizar status do pedido.',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      return result;
    } catch (erro) {
      throw new HttpException(
        'Falha ao atualizar IntencaoPagamento. Revise os dados enviados e tente novamente.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
