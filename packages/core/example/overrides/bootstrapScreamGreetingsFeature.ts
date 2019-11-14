import { triviality } from '../../src';
import { GreetingsFeature } from './GreetingsFeature';
import { LogFeature } from '../features/LogFeature';
import { ScreamGreetingsFeature } from './ScreamGreetingsFeature';

triviality()
  .add(LogFeature)
  .add(GreetingsFeature)
  .add(ScreamGreetingsFeature)
  .build()
  .then(({ logger, greetingService }) => {
    logger.info(greetingService.greet('Triviality'));
  });
