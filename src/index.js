console.clear();
import {recordatorio} from "./lib/recordatorio.js"
import app from "./app.js";
import {port} from './config.js'
await import('./database.js');

app.listen(port);
recordatorio();
console.log("Servidor en el puerto", port);