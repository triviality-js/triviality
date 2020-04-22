/**
 * Refactored version of https://gist.github.com/antonmedv/2d2d478a41d7fcbc1bcb Anton Medvedev
 *
 *       SELECT_________________
 *      /            \          \
 *     .___         FROM       JOIN
 *    /    \          |       /    \
 *   a  city_name  people  address ON
 *                                  |
 *                                  =___________
 *                                 /            \
 *                                .____          .
 *                               /     \        / \
 *                               p  address_id  a  id
 *
 */

const repeat = (txt: string, times: number) => {
  let output = '';
  // tslint:disable-next-line:no-increment-decrement
  for (let i = 0; i < times; i++) {
    output += txt;
  }
  return output;
};

export function drawTree<T>(initial: T, getTitle: ((node: T) => string), getNodes: ((node: T) => T[])) {
  const whitespace = ' ';
  const output: string[] = [];

  const checkEmpty = (onLine: number) => {
    if (output[onLine] === undefined) {
      output[onLine] = '';
    }
  };

  const findPadding = (_txt: string, onLine: number, _position: number, margin: number = 2) => {
    checkEmpty(onLine);
    let padding = 0;
    let position = _position;
    const length = output[onLine].length;

    if (position < 0) {
      padding = -position;
      position = 0;
    }

    if (length >= position) {
      padding += length - position + margin;
    }

    return padding;
  };

  const insert = (txt: string, onLine: number, position: number) => {
    checkEmpty(onLine);

    const length = output[onLine].length;

    if (position < 0) {
      throw new Error(`Trying to insert "${txt}" at negative position(${position}).`);
    }

    if (position < length) {
      throw new Error(`Trying to insert "${txt}" at position(${position}) less then length(${length}).`);
    }

    output[onLine] += repeat(whitespace, position - length) + txt;
  };

  const drawNode = (tree: T, onLine: number, position: number) => {
    let padding = 0;
    let foundedPadding = 0;
    let nodePadding = 0;
    let node: T;
    let title: string;
    let offset = 0;
    let currentTitle = getTitle(tree);
    const nodes: T[] = getNodes(tree);

    if (nodes && nodes.length !== 0) {
      let at = position;
      if (nodes.length === 1) {
        node = nodes[0];
        title = getTitle(node);

        const halfOfCurrentTitle = Math.floor(currentTitle.length / 2);
        offset = Math.floor(title.length / 2) - halfOfCurrentTitle;

        foundedPadding = findPadding(title, onLine + 2, position - offset);

        nodePadding = drawNode(node, onLine + 2, position - offset + foundedPadding);
        insert('|', onLine + 1, position + halfOfCurrentTitle + foundedPadding + nodePadding);

        padding = foundedPadding + nodePadding;
      } else {
        // tslint:disable-next-line:no-increment-decrement
        for (let i = 0; i < nodes.length; i++) {
          node = nodes[i];
          title = getTitle(node);

          if (i === 0) {
            offset = title.length === 1 ? 2 : Math.floor(title.length / 2) + 1;
            foundedPadding = findPadding(title, onLine + 2, position - offset);
            nodePadding = drawNode(node, onLine + 2, position - offset + foundedPadding);
            insert('/', onLine + 1, position - 1 + foundedPadding + nodePadding);
            insert(repeat(whitespace, currentTitle.length), onLine + 1, position + foundedPadding + nodePadding);
            padding = foundedPadding + nodePadding;
            at += padding + currentTitle.length;
          } else {
            offset = title.length === 1 ? -1 : Math.floor(title.length / 2) - 1;
            foundedPadding = findPadding(title, onLine + 2, at - offset);
            nodePadding = drawNode(node, onLine + 2, at - offset + foundedPadding);
            at += foundedPadding + nodePadding;
            insert('\\', onLine + 1, at);
            currentTitle += repeat('_', foundedPadding + nodePadding);
          }
        }
      }
    }
    insert(currentTitle, onLine, position + padding);
    return padding;
  };

  drawNode(initial, 0, 0);

  return output.join('\n');
}
