import { IsNotEmpty, IsString, IsInt , IsOptional } from 'class-validator';


export class CreateChannelDto {
    @IsString()
    readonly mode: string;
  
    @IsOptional()
    @IsString()
    readonly password?: string;
  
    @IsInt ()
    readonly owner_id: number;
  }




