//<async, await> <-키워드임.
function delay(ms) {
	return new Promise((res, rej) => {
		if (typeof ms !== 'number') {
			rej(ms);
			return;
		}

		setTimeout(() => res(ms), ms);
	})
}

// 1.원래라면
// function hello() {
// 	delay(1000)
// 		.then((ms)=> {
// 			console.log('a');
// 			return delay("hello");
// 		})
// 		.catch(err => {
// 			console.log("삐빅");
// 			return delay(1000);
// 		})
// 		.then((ms) => {
// 			console.log('b');
// 			// return delay(100);
// 		});
// 		/* ... */
// }
// hello();

// 2.이렇게 "동기 코드 처럼" 바뀐다
//<async await 1>
// async function world() {
// 	await delay(1000); //await : await 뒤에 나온 Promise가 fullfilled 혹은 rejected될 때까지 일시 정지됨.
// 	console.log('a');
// 	await delay(1000);
// 	console.log('b');
// 	await delay("hello"); //만약 중간에 오류나면 이후 코드 실행이 다 멈춤. //에러결과: Uncaught (in promise) hello
// 	console.log('c');
// 	await delay(1000);
// 	console.log('d');
// 	await delay(1000);
// 	console.log('e');
// }
// world();

//<async await 2>
// async function good() {
// 	return 'hello';
// }
// // async함수는 기본적으로 Promise만 반환함.
// // 값을 반환하면 Promise로 감싸져 나옴. 따라서 promise객체 안에 hello가 들어가 있는 것.

// good().then(str => console.log(str)); //hello


// async function good2() {
// 	try {
// 		await delay(1000);
// 		console.log('a');
// 		await delay("hehe"); //오류나서 catch가 실행됨.
// 		console.log('b');
// 	} catch (err) {
// 		console.log("삐빅");
// 	}
// }
// good2(); //1초 뒤에 a,삐빅


//<try.. catch Error에 대해 공부합시다.>
// function hello() {
// 	/* .. 100줄짜리 코드 .. */

// 	try {   //<-try 실행 도중 오류가 나면 catch가 실행되고 그 밑에 코드가 다 실행됨.
//     	const obj = {};
// 		obj.hello();  
// 	} catch (err) {
// 		console.log(err) // TypeError

// 		if (err instanceof TypeError) {
// 			console.log('잘못된 호출');
// 		}
// 	}
// 	finally { //try 블록과 catch 블록(들)이 실행을 마친 후 항상 실행됨.
// 		console.log('123');
// 	}
// 	console.log('이후 스크립트도 잘 호출됨');
// 	} 

// hello(); //결과 : 잘못된 호출, 123, 이후 스크립트도 잘 호출됨.


//<1. try .. catch 는 Proise의 reject를 처리할 수 없음>
//1)
try {
	delay('hello')
} catch (err) { 
	console.log('여기가 실행될것이라고 예상하지만 안됨');
}
//try에서 프로미스가 rejected상태가 되도 catch로 넘어오지 않음. 그냥 에러만 발생함

//2)
	try {
		delay('hello').catch(err => {
			console.log('여기만 실행됨');
		})
	} catch (err) {
		console.log('여기가 실행될것이라고 예상하지만 안됨');
	}
 //프로미스 생성자함수로 실행되어 나온 reject는 try 밑에 "catch"에 안걸림. 따라서 catch로 등록시켜 놓고 기다려야 함.


// <2. 그런데 async await 에서는 try .. catch를 Proise의 reject를 처리할 수 있음>
// 비동기 코드를 동기코드처럼 쓸 수 있게 됨.(then으로 등록시겨놧다 기다리는 형식이x)
async function test() {
	try {
		await delay('hello');
	} catch (err) {
		console.log('delay Promise가 reject되고. 여기에 걸림 async .. await이라서')
	} finally {
		//
	}
}
test();
