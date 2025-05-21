import { Module } from '@nestjs/common';
import { BoardCaslAbilityFactory } from './board-casl.factory';

@Module({
  providers: [BoardCaslAbilityFactory],
  exports: [BoardCaslAbilityFactory],
})
export class BoardCaslModule {}
