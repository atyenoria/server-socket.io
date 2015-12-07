// str = 'こんにちは';

// console.log(str + ": " + str.length + " characters, " +
//   Buffer.byteLength(str, 'utf8') + " bytes");

// str = '級数';
// console.log(str + ": " + str.length + " characters, " +
//   Buffer.byteLength(str, 'utf8') + " bytes");


// str = '你好';
// console.log(str + ": " + str.length + " characters, " +
//   Buffer.byteLength(str, 'utf8') + " bytes");

// str = '¥@*./';
// console.log(str + ": " + str.length + " characters, " +
//   Buffer.byteLength(str, 'utf8') + " bytes");


// require('es6-promise').polyfill();
// require('isomorphic-fetch');



// fetch("http://localhost:5001/message", {
//   method: 'POST',
//   headers: {
//      'Content-Type': 'application/json',
//     'Accept' : 'application/json'
//   },
//   body: JSON.stringify({
//     jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoib3duZXIxIiwicm9vbSI6InJvb20xIiwiaWF0IjoxNDQ5NDk1NTAyfQ.0qKFE6wmpPPJZ6FBdWEu-25HsjFWYwsVXt7DCxIelTs',
//     pass: 'bar'
//   })
// }).then(response => console.log(response))



// fetch("http://localhost:5001/message", {
//   method: 'GET',
//   headers: {
//      'Content-Type': 'application/json',
//     'Accept' : 'application/json'
//   }
//  } ).then(response => console.log(response))


var fetch = require('node-fetch');

fetch('http://localhost:5001/message/', { method: 'POST', body: JSON.stringify({jwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjoib3duZXIxIiwicm9vbSI6InJvb20xIiwiaWF0IjoxNDQ5NDk1NTAyfQ.0qKFE6wmpPPJZ6FBdWEu-25HsjFWYwsVXt7DCxIelTs'})})
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
    });
