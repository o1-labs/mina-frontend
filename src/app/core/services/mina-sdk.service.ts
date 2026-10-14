import { Injectable } from '@angular/core';
import { MinaClient } from '@o1-labs/mina-sdk';
import { defer, from, Observable } from 'rxjs';
import { getURL } from '@shared/constants/config';
import { MinaNode } from '@shared/types/core/environment/mina-env.type';

/**
 * The daemon clients of the app, from `@o1-labs/mina-sdk`: one for the
 * active node (`client`, set with `changeNode`) and one per daemon GraphQL
 * URL (`clientFor`). Every daemon call of the app goes through them; the
 * log API (tracing) has its own service.
 */
@Injectable({
  providedIn: 'root',
})
export class MinaSdkService {

  private active: MinaClient | undefined;
  private readonly clients = new Map<string, MinaClient>();

  changeNode(node: MinaNode): void {
    this.active = this.clientFor(node.graphql + '/graphql');
  }

  /** The client of the active node. */
  get client(): MinaClient {
    if (!this.active) {
      throw new Error('No active node');
    }
    return this.active;
  }

  /** A client for a daemon's GraphQL URL; a path is resolved against the origin. */
  clientFor(url: string): MinaClient {
    const graphqlUri = getURL(url);
    let client = this.clients.get(graphqlUri);
    if (!client) {
      client = new MinaClient({ graphqlUri, retries: 1, timeoutMs: 30_000, logger: null });
      this.clients.set(graphqlUri, client);
    }
    return client;
  }

  /** Runs a call against the active node, as an Observable that starts on subscription. */
  call<T>(fn: (client: MinaClient) => Promise<T>): Observable<T> {
    return defer(() => from(fn(this.client)));
  }

  /** Runs a call against the daemon at `url`, as an Observable that starts on subscription. */
  callOn<T>(url: string, fn: (client: MinaClient) => Promise<T>): Observable<T> {
    return defer(() => from(fn(this.clientFor(url))));
  }
}
