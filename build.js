import secure from "./src/index";

( function(win) { Object.defineProperty(win, 'SECURE', { value: secure }); }( window ) );