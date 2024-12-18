import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtualizarStatusIntencaoPagamentoController } from '../../adapters/controllers/atualizarIntencaoPagamento-controller';
import { ConsultarIntencaoPagamentoPorIdController } from '../../adapters/controllers/consultarIntencaoPagamento-controller';
import { CriarIntencaoPagamentoController } from '../../adapters/controllers/criarIntencaoPagamento-controller';
import { IntencaoPagamentoDTO } from '../../dto/intencaoPagamentoDTO';
import { AtualizarIntencaoPagamentoDTO } from '../../dto/atualizarIntencaoPagamentoDTO';
import { CriarIntencaoPagamentoDTO } from '../../dto/criarIntencaoPagamentoDTO';

@ApiTags('Pagamentos')
@Controller('pagamentos')
export class PagamentosAPIController {
  constructor(
    private readonly atualizarStatusIntencaoPagamentoController: AtualizarStatusIntencaoPagamentoController,
    private readonly consultarIntencaoPagamentoPorIdController: ConsultarIntencaoPagamentoPorIdController,
    private readonly criarIntencaoPagamentoController: CriarIntencaoPagamentoController,
  ) {}

  @Post('/webhook/:id')
  @ApiOperation({
    summary: 'Webhook para atualizar status de Intenção de Pagamento',
    description:
      'Atualiza apenas status do pedido, os status possíveis são [EM_ANALISE, RECUSADO, FINALIZADO]',
  })
  @ApiResponse({
    status: 201,
    description: 'Status da Intenção de Pagamento atualizado com sucesso.',
  })
  @HttpCode(200)
  async atualizarStatusIntencaoPagamento(
    @Param('id') id: string,
    @Body() atualizarStatusIntencaoPagamento: AtualizarIntencaoPagamentoDTO,
  ): Promise<IntencaoPagamentoDTO> {
    return await this.atualizarStatusIntencaoPagamentoController.execute(
      id,
      atualizarStatusIntencaoPagamento,
    );
  }

  @Post('/')
  @ApiOperation({
    summary: 'Rota para criar intenção de pagamento',
    description: 'Retorna a nova Intenção de Pagamento',
  })
  @ApiResponse({
    status: 201,
    description: 'Status da Intenção de Pagamento atualizado com sucesso.',
  })
  async criarIntencaoPagamento(
    @Body() criarIntencaoPagamento: CriarIntencaoPagamentoDTO
): Promise<IntencaoPagamentoDTO> {
    return await this.criarIntencaoPagamentoController.execute(criarIntencaoPagamento);
  }

  @Get('/:idIntencao')
  @ApiOperation({
    summary: 'Consulta uma Intenção de Pagamento pelo Id.',
    description: 'Retorna uma Intenção de Pagamento com base no id.',
  })
  @ApiResponse({ status: 200, description: 'Intenção encontrada.' })
  @ApiResponse({ status: 404, description: 'Intenção não encontrada.' })
  async consultarPedidoPorId(
    @Param('idIntencao') idIntencao: string,
  ): Promise<IntencaoPagamentoDTO> {
    return await this.consultarIntencaoPagamentoPorIdController.execute(
      idIntencao,
    );
  }
}
