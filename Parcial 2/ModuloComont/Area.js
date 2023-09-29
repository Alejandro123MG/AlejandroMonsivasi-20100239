function AreaCuadrado(lado){
    return lado*lado;
}

function AreaTriangulo(base, altura){
return ((base*altura)/2)
}

module.exports.AreaCuadrado=AreaCuadrado;
module.exports.AreaTriangulo=AreaTriangulo;

/*console.log(__dirname);
console.log(__filename);*/
console.log(module);