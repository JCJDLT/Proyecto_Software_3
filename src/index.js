console.clear();

import app , {__dirname} from "./app.js";
import {port} from './config.js'
await import('./database.js');

app.listen(port);
console.log("Servidor en el puerto", port);
console.log(__dirname)