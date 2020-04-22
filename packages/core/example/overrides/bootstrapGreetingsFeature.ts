import { triviality } from '../../src';
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
