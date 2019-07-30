import { CasualGreetingService } from '../overrides/services/CasualGreetingService';

export function greetingService() {
  return new CasualGreetingService();
}

export const GreetingsFeature = () => ({
  greetingService,
});
