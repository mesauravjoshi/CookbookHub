// function traditional () {
//     console.log(this);
//     console.log('one');
//     console.log(name);
//     console.log('two');
// }
// console.log(typeof traditional());

// const arrow =() => {
// }
const one = '1';
// console.log(typeof one);

// console.log(isNaN(one));
// console.log(typeof null);

const obj = {
    name: "John",
    sayName: function () {
        const self = this; // Capture `this` in a variable
        console.log(self);
        console.log(this.name); // 'John' (refers to obj)
    }
};
// obj.sayName();

const obj1 = {
    name: "John",
    sayName: () => {
        const self = this; // Capture `this` in a variable
        console.log(self);
        // console.log(this);
        console.log(self.name); // undefined (inherits from global scope)
    }
};
// obj1.sayName();

// Trying to call the arrow function before declaration
// greet(); // Throws an error: greet is not a function

// Arrow function declaration
// const greet = () => {
//     console.log("Hello, world!");
// };

// Calling the arrow function after declaration
// greet(); // Outputs: Hello, world!


function show() {
    console.log(this);
}
// show(); // window (in non-strict mode)

// const myPromise = new Promise((resolve, reject) => {
//     let success = true; // Simulating success/failure
//     if (success) {
//         resolve("Task completed successfully!");
//     } else {
//         reject("Task failed!");
//     }
// });

// // console.log(myPromise);
// myPromise
//   .then((result) => {
//     console.log(result); // Logs: "Task completed successfully!"
//   })
//   .catch((error) => {
//     console.log(error); // Logs: "Task failed!" (if success = false)
//   })
//   .finally(() => {
//     console.log("End");
//   });


async function greet() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('ram'); // Resolve the promise after 6 seconds
        }, 2000);
    });
}

const promise = greet(); // Get the promise
// console.log(promise); // Logs Promise { <pending> }
async function callGreet() {

    const result = await promise; // Wait for promise to resolve
    console.log("Resolved Value:", result);  // Logs 'ram'
    console.log(promise); // Logs Promise { <pending> }
}

// callGreet();

function api() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve("username saurav!");
            // reject("An error occurred wh?ile fetching data!");
        }, 2000);
    });
}

async function getData() {
    console.log("Fetching data...");
    try {        
        const result = await api();  // Waits here until fetchData() is resolved
        console.log(result);
        console.log("Done.");
    } catch (error) {
        console.log(error);
    }
}

// getData();


const a = {
    name: 'ram',
    sayName1 : function fun() {
        console.log(this);
    },
    sayName : () => {
        console.log(this);
    }
}  
// a.sayName1();

// ++++++++++++++++++ Question 
// let x = "hello";
// let y = new String("hello");
// console.log(typeof y);

// console.log(x == y);
// console.log(x === y);

// ++++++++++++++++++ Question 

// let x = [];
// let y = [];
// let z = x + y;

// console.log(z); // empty string 
// console.log(typeof z);

// ++++++++++++++++++ Question 

// let x = [1, 2, 3, 4, 5];
// let y = x.filter((n) => n >= 3);

// console.log(y);

// ++++++++++++++++++ Question 

// let x = true ;
// let y = false;
// let z = x + y && x * y;
// console.log(1 && 0);


// ++++++++++++++++++ Question 

// function foo(a, b) {
//     console.log(arguments[1]);
//   }
  
// foo(3);

// ++++++++++++++++++ Question 
// let x = "false";
// let y = !x;

// console.log(y);

// ++++++++++++++++++ Question 

// let x = 1;
// let y = "1";

// console.log(++x, ++y);


// ++++++++++++++++++ Question 
var num = 8;
var num = 10;

console.log(num);
// ++++++++++++++++++ Question 
// ++++++++++++++++++ Question 

