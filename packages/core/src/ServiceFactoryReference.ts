/**
 * Context for creating new service factories.
 */
import {ServiceFactory, SF} from './ServiceFactory';
import {isString} from "lodash";

export interface ServiceFactoryReference<S> {
    (): S;

    overrideService(factory: (original: SF<S>) => S): ServiceFactoryReference<S>;

    setup(): Promise<void>;
}

export type SFR<S> = ServiceFactoryReference<S>;

export function isServiceFactoryReference<S>(sf: () => S): sf is ServiceFactoryReference<S> {
    if (typeof sf !== 'function') {
        return false;
    }
    return typeof (sf as any).overrideService === 'function' &&
        typeof (sf as any).setup === 'function';
}

/**
 * The core overriding and setup services.
 *
 *
 * 
 *
 */
export const asServiceFactoryReference = <T>(sf: SF<T>, setup?: () => Promise<void>): ServiceFactoryReference<T> => {
    if (isServiceFactoryReference(sf)) {
        return sf;
    }
    let setupPending = true;


    function findServiceName() {
        if (isString(sf.name) && sf.name.length !== 0) {
            return sf.name;
        }

    }

    function assertSetup() {
        if (setupPending) {
            throw new Error(`${}`);
        }
    }

    /**
     * Creates new ServiceFactoryReference function.
     *
     * Preserves the function name.
     *
     * @internal
     */
    function createEmptyFunction<T>(sf: () => T): ServiceFactoryReference<T> {
        if (isString(sf.name) && sf.name.length !== 0) {
            const obj = {
                [sf.name]: () => {
                    return sf();
                }
            };
            return obj[sf.name] as any;
        } else {
            return (() => sf()) as any;
        }
    }


    let sfr!: ServiceFactoryReference<T>;
    sfr = createEmptyFunction(sf);
    sfr.overrideService = (factory: (original: SF<T>) => T): ServiceFactoryReference<T> => {
        const reference = sfr;
        return sfr = asServiceFactoryReference(() => factory(reference));
    };
    sfr.setup = async () => {
        setupCalled = true;
    };
    return sfr;
};

export const wrapReturnAsServiceFactoryReference: <T extends ((...args: any[]) => ServiceFactory<any>)>(toWrap: T) => T =
    ((toWrap: any) => (...args: any[]): ServiceFactory<any> => asServiceFactoryReference(toWrap(...args))) as any;
