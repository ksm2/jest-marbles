# @ksm2/jest-marbles

> Jest extension to test [WHATWG Streams] with [Marble Syntax]

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)
- [See Also](#see-also)
- [License](#license)

## Install

Use either

    yarn add @ksm2/jest-marbles

or

    npm install @ksm2/jest-marbles

## Usage

This module allows you to test [WHATWG Streams] with [Marble Syntax] in Jest.

```js
import { marbles } from "@ksm2/jest-marbles";
import { filter } from "@ksm2/stream-transformers";

describe("filter", () => {
  it("should filter a stream by a predicate", async () => {
    const act = marbles`---${1}-${2}--${3}-${4}---|`;
    const exp = marbles`--------${2}-------${4}---|`;

    await expect(act.pipeThrough(filter(isEven))).toStream(exp);
  });

  it("should fail the other stream", async () => {
    const act = marbles`---${1}-${2}--x`;
    const exp = marbles`--------${2}--x`;

    await expect(act.pipeThrough(filter(isEven))).toStream(exp);
  });
});

function isEven(num: number): boolean {
  return num % 2 === 0;
}
```

## Contributing

This project is open to feedback and contributions, please open an issue.

`isomorphic-streams` follows the [Contributor Covenant] Code of Conduct.

## See Also

Also have a look at the following NPM Packages:

- [isomorphic-streams](https://github.com/ksm2/isomorphic-streams) - Isomorphic package for WHATWG Streams ins Node.js and the browser.
- [@ksm2/stream-transformers](https://github.com/ksm2/stream-transformers) - Reusable stream transformers similar to ReactiveX Operators.

## License

MIT © 2021 Konstantin Möllers, see [LICENSE].

[whatwg streams]: https://streams.spec.whatwg.org/
[marble syntax]: https://rxjs.dev/guide/testing/marble-testing
[license]: https://github.com/ksm2/jest-marbles/blob/main/LICENSE
[contributor covenant]: https://github.com/ksm2/jest-marbles/blob/main/CODE_OF_CONDUCT.md
