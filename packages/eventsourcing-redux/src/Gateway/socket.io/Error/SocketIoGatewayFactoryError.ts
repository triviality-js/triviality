
export class SocketIoGatewayFactoryError extends Error {

  public static alreadyOpen(namespace: string) {
    return new this(`Socket with ${namespace} already open`);
  }

  public static notOpen(namespace: string) {
    return new this(`Socket with ${namespace} is not open`);
  }

}
