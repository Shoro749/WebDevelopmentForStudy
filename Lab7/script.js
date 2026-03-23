// ex 1
// Першим виконається big.js, тому що браузер виконує скрипти послідовно
// в порядку підключення, і другий не почне виконуватись, поки не завершиться перший.

// ex 2

var a = 2;
var x = 1 + (a *= 2); // x = 5, тому що a множить саму на себе 2 і присваює собі добуток

console.log(x);

// 2

if ("0") { alert('Привіт'); } // так, alert з’явиться, тому що рядок "0" є truthy значенням у JavaScript.

let name = "Василь";
let admin = name;

console.log(admin);

// ex 3

async function fetchCounties() {
    const response = await fetch("https://api.census.gov/data/2020/acs/acs5/profile?get=NAME&for=county:*");
    const data = await response.json();

    return data.slice(1).map(item => ({
        name: item[0],
        state: item[1],
        county: item[2]
    }));
}

function findCountyCode(counties, countyName) {
    const found = counties.find(c => c.name === countyName);
    return found ? found.state + found.county : "Not found";
}

// ex 4



// ex 5

let position = 0;

function moveLeft() {
    position -= 100;
    document.getElementById("elid").style.left = position + "px";
}

function moveRight() {
    position += 100;
    document.getElementById("elid").style.left = position + "px";
}