let areas= require("./Area.js");

let a= areas.AreaCuadrado(4);

console.log(a);

let cowsay = require("cowsay");

console.log(cowsay.say({
    text : "I'm a moooodule",
    e : "oO",
    T : "U "
}));


// Importa la función `shuffle` de lodash
const shuffle = require('lodash/shuffle');

const arr = [1, 2, 3, 4, 5];
console.log('Array original:', arr);

// Mezcla el array utilizando la función `shuffle`
const arrMezclado = shuffle(arr);
console.log('Array mezclado:', arrMezclado);
