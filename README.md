# babel-plugin-import-resolver

Resolve import to specific file.

## Example

#### In

```js
import { A, B, C as D } from '../components';
```

#### Out

```js
import A from '../components/A/A';
import B from '../components/B/B';
import D from '../components/C/C';
```

## Installation

```bash
$ npm install babel-plugin-import-resolver
```

## Usage

#### Via Node API

```js
require('babel-core').transform('code', {
  plugins: ['import-resolver', {
    locate: (name, source) => {
      if (source.match(/^(\.|\/).*\/components$/)) {
        return `${source}/${name}/${name}`;
      }
      return source;
    },
  }],
});
