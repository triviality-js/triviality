
/**
 * Incremental number of all events that have passed. This will let us know if we are missing any events if the order is
 * incorrect.
 */
export type Playhead = number;

export const INITIAL_PLAYHEAD: Playhead = 0;
