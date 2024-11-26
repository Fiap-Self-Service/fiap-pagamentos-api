import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CriarIntencaoPagamentoDTO {
  @ApiProperty({
    description: 'Valor do pagamento',
    example: 100.50,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'O valor deve ser um número positivo maior que zero.' })
  valor: number;
}
