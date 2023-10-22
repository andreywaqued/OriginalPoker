let a = {valor: 1}
let b = a
a.valor = 2.25
console.log(a)
console.log(b)
console.log(typeof(a.valor) === "number")
// function test(a) {
//     console.log(a)
//     let timeout = setTimeout(()=>{console.log("timeout :" + a.valor)}, 1000)
//     // console.log(a)
// }
// test(a)
// a.valor = 2
// test(a)