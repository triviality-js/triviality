import {replace} from "ramda";

/**
 * Remove any doc block characters from a string
 *
 * //
 *
 * /**
 *  *
 *  * /
 */
export const stripDocBlock = replace(/^ *(\/?\*+|\/\/)/gm, '');

