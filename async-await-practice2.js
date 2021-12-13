/** 메인함수 */
async function getGonghus(list){
  /*
   // 방법1 - promise버전 , api호출을 "병렬"로 한 방법
   let promiseArr = []; // ['202102', '202103', '202105', '201903'] => [Promise<["설날"]>, Promise<[string]>, Promise<[string]>, Promise<[string]>];

    for (let el of list) {
      promiseArr.push(fetchGonghu(el)); //차이★ 한번에 fetchGonghu함수의 fetch(url)까지 실행해 놓게 됨(따라서 병렬로 api호출하게 됨)
    }
    
    //await 뒤에는 프로미스를 적어두면 됨.
   let values = await Promise.all(promiseArr); // [["설날"], [string],[string], [string]];  //모든 프로미스객체가 resolve되면 프로미스 객체 중 값만 나옴.
      let obj = {};
      for (let i = 0; i < values.length; i++) {
        obj[list[i]] = values[i];
      }
      return obj;
  */
      
/*
   //방법2 - async,await버전 , api호출을 "직렬"로 한 방법(순차적으로 호출)
    let values = []; //[["설날"], ["설날"],["설날"],["설날"]]; "await"붙이고 fetchGonghu()해서 이렇게 바로 값만 푸쉬됨.(프로미스가 아니라)

    for (let el of list) {
        values.push(await fetchGonghu(el)); 
        //차이★ fetchGonghu함수 앞에 async가 붙어있으므로 fetchGonghu함수가 전체 실행되서 프로미스가 fulfilled 되어, 프로미스가 반환될 때 까지 기다림
        //이후 순차적으로 api 호출하게 됨. 따라서 직렬로 호출하는 것임.
    }

   let obj = {};
      for (let i = 0; i < values.length; i++) {
        obj[list[i]] = values[i];
      }
      return obj;
 */

}

/** 실행코드 */
getGonghus(['202102', '202103', '202105', '201903']).then(console.log);


/** 공휴일 이름 가져오는 함수 */
async function fetchGonghu(yyyyMM) { 
    //fetch와는 다르게 async는 함수 안에서 어떤 값을 반환하면 그 값은 자동으로 프로미스 객체로 씌워서 반환해줌.
    //fetch는 return fetch를 붙여줘야 프로미스객체가 반환됨.
    const year = yyyyMM.slice(0, 4);
    const month = yyyyMM.slice(4, 6);
    const url = `/api/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=UAgtSMCoPNcKBH0rq%2BiiIBvdktwP3wHzjXcataapt5GCjVhWq9UquF5UiX%2FpO1%2FzJ3BVghFAncuZNvSpRIln1A%3D%3D&solYear=${year}&solMonth=${month}&_type=json`;

    let response =  await fetch(url);
    let result = await response.json();
    let gonghus = result.response.body.items.item;

    if (!gonghus) {
        //undefinde가 true가 됨.
        return [];
      }

      let arr = [];

      if (!Array.isArray(gonghus)) {
        arr = [gonghus];
      } else {
        arr = gonghus;
      }

      // 객체 배열을 돌면서 객에 안의 dateName을 객체의 키로 담아서 중복을 제거해야함
      const result2 = {};

      for (let obj of arr) {
        result2[obj.dateName] = 1; //객체는 키가 유니크해서 똑같은 키이름으로 중복하여 만들 수 없고, 마지막걸로 덮어짐!!!!

      } 

      return Object.keys(result2); // ['설날'] ,  ['어린이날', '부처님오신날']
      //Object.keys : 객체의 프로퍼티명(키)를 동일순서로 배열에 담아 반환함.
}




