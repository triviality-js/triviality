import { triviality } from '@triviality/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';
import { FormalGreetingsFeature } from './FormalGreetingsFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .add(FormalGreetingsFeature)
  .build()
  .then(({
           logger,
           greetingService,
         }) => {
    logger.info(greetingService.greet('Triviality'));
  });
