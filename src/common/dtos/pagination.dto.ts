import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @ApiProperty({
    default: 10,
    description: 'How manu rows do you need',
  })
  @IsOptional()
  @IsPositive()
  //transformar
  @Type(() => Number) //enableImplicitConversions:true
  limit?: number;

  @ApiProperty({
    default: 10,
    description: 'How manu rows do you want to skip',
  })
  @IsOptional()
  // @IsPositive()
  @Min(0)
  @Type(() => Number) //enableImplicitConversions:true
  offset?: number;
}
