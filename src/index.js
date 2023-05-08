console.clear();
import {recordatorio} from "./lib/recordatorio.js"
import app from "./app.js";
import {port} from './config.js'
await import('./database.js');

app.listen(port);
try {
    await recordatorio();
} catch (error) {
    req.flash("error", "Disculpe ocurrio un error en el sistema");
}
console.log("Servidor en el puerto", port);