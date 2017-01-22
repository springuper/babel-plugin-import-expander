# babel-plugin-import-expander

[![Build Status](https://travis-ci.org/springuper/babel-plugin-import-expander.svg?branch=master)](https://travis-ci.org/springuper/babel-plugin-import-expander)

Expand multiple members `import` to specific module `import`, mainly for performance concerns.

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
$ npm install babel-plugin-import-expander
```

## Usage

#### Via `.babelrc` (Recommended)

```js
{
  "plugins": [
    ["import-expander", {
      "condition": "^(\\.|\\/).*\\/components$",
      "template": "{source}/{name}/{name}"
    }]
  ]
}
```

There are two options:

- `condition` (`String` or `[String]`)

  One or multiple string format regular expressions, if the source of ImportDeclaration matches any of them, it will be replaced by the following `template`. 
- `template` (`String`)

  Used to replace hit source with a simple variable placeholder presentation. There are mainly two variable placeholders: `{source}` represents the source of ImportDeclaration, and `{name}` represents imported name.

#### Via Node API

```js
require('babel-core').transform('code', {
  plugins: ['import-expander', {
    condition: '^(\\.|\\/).*\\/components$',
    template: '{source}/{name}/{name}',
  }],
});
