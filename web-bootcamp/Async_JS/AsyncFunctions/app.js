
//===================
// ASYNC FUNCTIONS 
//===================
//  A newer and cleaner syntax for working with async code!
// Syntax "makeup" for promises (깔끔한 코드 작성을 돕는다)

//===================
// The async keyword
//===================
// Async functions always return a promise
    // async, which we do by just putting the async keyword in front of the function, that function automaticallyreturns a promise.
    //Even though I never said return a promise explicitly, at least it returns a promise.
        // async function hello() {
        // } // 
        // hello()
        // Promise {<fulfilled>: undefined}
        // [[Prototype]]: Promise
        // [[PromiseState]]: "fulfilled"
        // [[PromiseResult]]: undefined

// if the function returns a value, the promise will be resloved with that value
// if the function throws an exception, the promise will be rejected 

async function sing() {
    throw "OH NO, PROBLEM!"
    return 'LA LA LA LA'
}

sing()
    .then(data => {
        console.log("PROMISE RESOLVED WITH:", data)
    })
    .catch(err => {
        console.log("OH NO, PROMISE REJECTED!")
        console.log(err)
    })




const login = async (username, password) => {
    if (!username || !password) throw 'Missing Credentials'
    if (password === 'corgifeetarecute') return 'WELCOME!'
    throw 'Invalid Password'
}

login('todd', 'corgifeetarecute')
    .then(msg => {
        console.log("LOGGED IN!")
        console.log(msg)
    })
    .catch(err => {
        console.log("ERROR!")
        console.log(err)
    })




// =======================
// The await keyword
// =======================
// We can only use the await keyword inside of functions declared with async.
// await will pause the execution of the function, waiting for a promise to be resolve 



const delayedColorChange = (color, delay) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            document.body.style.backgroundColor = color;
            resolve();
        }, delay)
    })
}

// delayedColorChange('red', 1000)
//     .then(() => delayedColorChange('orange', 1000))
//     .then(() => delayedColorChange('yellow', 1000))
//     .then(() => delayedColorChange('green', 1000))
//     .then(() => delayedColorChange('blue', 1000))
//     .then(() => delayedColorChange('indigo', 1000))
//     .then(() => delayedColorChange('violet', 1000))


async function rainbow() { 
    //.then을 쓰지 않아도 되고, 콜백을 전달하거나, 반한된 값을 연결할 필요도 없다.
    // So I only await promises or functions that return a promise right like this here.
    await delayedColorChange('red', 1000) 
    await delayedColorChange('orange', 1000)
    await delayedColorChange('yellow', 1000)
    await delayedColorChange('green', 1000)
    await delayedColorChange('blue', 1000)
    await delayedColorChange('indigo', 1000)
    await delayedColorChange('violet', 1000)
    return "ALL DONE!"
}

// rainbow().then(() => console.log("END OF RAINBOW!"))


async function printRainbow() {
    await rainbow();
    console.log("END OF RAINBOW!")
}

printRainbow();

const fakeRequest = (url) => {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (4500)) + 500;
        setTimeout(() => {
            if (delay > 2000) {
                reject('Connection Timeout :(')
            } else {
                resolve(`Here is your fake data from ${url}`)
            }
        }, delay)
    })
}


// 비동기 함수의 오류 처리 
async function makeTwoRequests() {
    try {
        let data1 = await fakeRequest('/page1');
        console.log(data1);
        let data2 = await fakeRequest('/page2');
        console.log(data2);
    } catch (e) {
        console.log("CAUGHT AN ERROR!")
        console.log("error is:", e)
    }

}
