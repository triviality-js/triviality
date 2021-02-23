import { triviality } from '@triviality/core';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .build()
  .then(({
           logger,
           greetingService,
         }) => {
    logger.info(greetingService.greet('Triviality'));
  });
