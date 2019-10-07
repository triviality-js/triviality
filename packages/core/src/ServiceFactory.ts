
export type ServiceFactory<T = unknown> = () => T;
export type SF<T = unknown> = ServiceFactory<T>;

export type ServiceFactoryType<T> = T extends SF ? ReturnType<T> : T;
export type ServiceTag = string;

/**
 * TODO: fix name, and maybe move this?
 */
export type TaggedServiceFactory<Tag, Service> = (tag: Tag) => Service;
export type TSF<Tag, Service> = TaggedServiceFactory<Tag, Service>;
