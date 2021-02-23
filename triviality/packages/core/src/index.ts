import { ServiceContainerFactory } from './ServiceContainerFactory';

export * from './ServiceContainerFactory';
export * from './Value';
export * from './Feature';

export const triviality = ServiceContainerFactory.create;
export default triviality;
