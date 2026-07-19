# Pyware Parser

Parse .3da (3d Mobile App) and .snc (Audio Sync) files from Pyware v11.

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

## License
GNU GPLv3