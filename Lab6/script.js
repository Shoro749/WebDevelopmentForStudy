// ex 1

let a = 1;
let b = 2;

console.log('a = ', a, 'b = ', b);
console.log('a + b = ', a + b);
console.log('a - b = ', a - b);
console.log('a * b = ', a * b);
console.log('a / b = ', a / b);

// ex 2

let firstName = 'Vanya';
let lastName = 'Vanish';
let fullName = firstName + ' ' + lastName;

console.log('Hello mr', fullName);

// ex 3

let age = 10;

if (age <= 18) { console.log('Access prohibited (age = ', age, ').'); }
else { console.log('Access allowed (age = ', age, ').'); }

// ex 4

for (let i = 1; i <= 10; i++) { console.log(i); }

// ex 5

console.log('Square of 5: ', square(5));

function square(number) { return number * number; }

// ex 6

let fruits = ['banana', 'apple', 'orange'];
fruits.push('green banana');
fruits.forEach(fruit => console.log(fruit));