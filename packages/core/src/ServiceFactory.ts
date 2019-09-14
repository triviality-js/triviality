export type ServiceFactory<T = unknown> = () => T;
export type SF<T = unknown> = ServiceFactory<T>;

export type ServiceFactoryType<T> = T extends SF ? ReturnType<T> : T;
