# Pyware Parser

Parse .3da (3d Mobile App) and .snc (Audio Sync) files from Pyware v11.

## Installation
```bash
npm install pyware.js
```

## Usage
Parsing a .3da file:
```js
import {parsePyware3DAFile} from 'pyware.js';

const parsed = parsePyware3DAFile(buffer);
console.log(parsed);
/*
{
    headerInfo: ...,
    generalInfo: ...,
    gridPattern: ...,
    cast: ...,
    productionTab: ...,
    pages: ...
};
*/
```

Parsing a .snc file:
```js
import {parsePywareSNCFile} from 'pyware.js';
const parsed = parsePywareSNCFile(buffer);
console.log(parsed);
/*
{
    filePath: ...,
    arrLength: ...,
    timestamps: [...],
}
*/
```

## Web Demo
To view a demonstration of the parser in action, visit [the web demo](https://pyware-parser.vercel.app). You may also find a sample .3da file attached [here](https://github.com/alaninnovates/pyware.js/raw/refs/heads/main/web/public/HexedMov3.3da).

## License
GNU GPLv3