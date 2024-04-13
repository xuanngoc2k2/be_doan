import { PartialType } from '@nestjs/mapped-types';
import { CreateListVocabDto } from './create-list-vocab.dto';

export class UpdateListVocabDto extends PartialType(CreateListVocabDto) {}
