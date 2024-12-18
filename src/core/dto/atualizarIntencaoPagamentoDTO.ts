import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { IntencaoPagamentoStatusType } from '../entities/intencaoPagamentoStatus-type.enum';

export class AtualizarIntencaoPagamentoDTO {
  @ApiProperty({ default: IntencaoPagamentoStatusType.FINALIZADO })
  @IsNotEmpty()
  @IsEnum(IntencaoPagamentoStatusType)
  status: string;

  dataFinalizacao: Date | null;
}
