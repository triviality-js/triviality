import {ServicesAsFactories} from './ServiceFactory';
import {FeatureFactoryContext} from "../Context";
import {KernelFeatureServices} from "../Feature";
import {ContainerError} from "../Error";

export type FeatureFactory<OwnServices, Dependencies = {}> =
  ((this: ServicesAsFactories<OwnServices & Dependencies>, services: FC<Dependencies, OwnServices>) => ServicesAsFactories<OwnServices>);

export type FC<Dependencies, OwnServices> = FeatureFactoryContext<OwnServices & Dependencies>;
export type UFC = FC<unknown, unknown>;

export type FF<OwnServices, Dependencies = {}> = FeatureFactory<OwnServices, Dependencies>;
export type UFF = FeatureFactory<unknown, unknown>;

