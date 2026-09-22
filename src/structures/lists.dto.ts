import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class WhatsAppList {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  chatCount?: number;
}

export class CreateWhatsAppListBody {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  chatIds?: string[];
}

export class RenameWhatsAppListBody {
  @IsString()
  name: string;
}

export class MutateWhatsAppListChatsBody {
  @IsArray()
  @IsString({ each: true })
  chatIds: string[];
}
