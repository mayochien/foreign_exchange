
export default class Format{}
//   上車前，請先引入 ↓↓
//
//   import Format from '../../services/Format';   
//
//   挑一台上車 Go!  ↓↓




//     ~~~~ ____   |~~~~~~~~~~~~~~~|  |~~~~~~~~~~~~~~~|
//    Y_,___|[]|   |   Math.round  |  |  Amount專用   |
//   {|_|_|_|PU|_,_|_______________|  |_______________|
//   oo---OO=OO      OOO      OOO       OOO       OOO

// 千分位 + Math.round + 小數點第3位
Format.thousandsMathRound3 = function(value) {
  let newValue = (Math.round(value*1000)/1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return newValue;
}

// 千分位 + Math.round + 小數點第6位
Format.thousandsMathRound6 = function(value) {
let parts = (Math.round(value*1000000)/1000000).toString().split(".");
parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return parts.join(".");
}




//       _____                 . . . . . o o o o o
//     __|[_]|__   ____________   ________     ____      o
//    |[] [] []|  |  toFixed  |  [ 匯率用 (__   ][]]_n_n__][.
//   _|________|_ [____________]_[__________]__|__|________)<
//     oo    oo '   oo     oo '   oo    oo '    oo 0000---oo\_

// 千分位 + toFixed + 小數點第3位
Format.thousandsToFix3 = function(value) {
  let newValue = parseFloat(value).toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return newValue;
}

// 千分位 + toFixed + 小數點第6位
Format.thousandsToFix6 = function(value) {
  let parts = (value).toFixed(6).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}




//         o o OO O o o o. . .   _____________________ _____=======_||____
//       o      _____           ||                   | |   _    _    _   |
//     .][__n_n_|DD[  ====_____  |    無條件捨去      | |  |_|  |_|  |_|  |
//    >(________|__|_[_________]_|___________________|_|_________________|
//   _/oo OOOOO oo`  ooo   ooo  'o!o!o         o!o!o`   'o!o         o!o`
  
// 千分位 + 無條件捨去 + 小數點第3位
Format.thousandsMathFloor3 = function(value) {
  let newValue = (Math.floor(value*1000)/1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return newValue;
}

// 千分位 + 無條件捨去 + 小數點第6位
Format.thousandsMathFloor6 = function(value) {
  let parts = (Math.floor(value*1000000)/1000000).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}




//          &&&&&&&&&
//         &&&
//        &&
//       &  _____   ________________
//      II__|[] |  |   I  整數  I   |
//     |        |__|_  I _____  I  _|
//     < OO----OOO   OO----OO----OO
// **********************************************************

// 千分位 + 整數 無條件捨去
Format.thousands = function(value) {
  let newValue = parseInt(value,10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return newValue;
}
  
