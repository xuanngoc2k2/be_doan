import { PartialType } from '@nestjs/mapped-types';
import { CreateResultDetailDto } from './create-result_detail.dto';

export class UpdateResultDetailDto extends PartialType(CreateResultDetailDto) {}
