import { PartialType } from '@nestjs/mapped-types';
import { CreateVocaboflistDto } from './create-vocaboflist.dto';

export class UpdateVocaboflistDto extends PartialType(CreateVocaboflistDto) {}
