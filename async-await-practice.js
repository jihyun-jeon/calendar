/**
 *문제- yyyyMM 문자열 배열을 받아서. 각 년/월에 있는 공휴일 목록을 출력하는 함수 getGonghus 를 만드시오
 *실행코드- getGonghus(['202102', '202103', '202105', '201903']).then(console.log)
 *결과-
 *   {
 *   '202102': ['설날'],
 *   '202103': ['삼일절'],
 *   '202105': ['어린이날', '어버이날'],
 *   '201903': ['삼일절],
 * }
 */

// 1. promise 버전
function getGonghus(list) {
  let promiseArr = []; // ['202102', '202103', '202105', '201903'] => [Promise<["설날"]>, Promise<[string]>, Promise<[string]>, Promise<[string]>];

  for (let el of list) {
    promiseArr.push(fetchGonghu(el));
  }

  return Promise.all(promiseArr).then((values) => {    // [["설날"], [string],[string], [string]];  //모든 프로미스객체가 resolve되면 프로미스 객체 중 값만 나옴.
    let obj = {};
    for (let i = 0; i < values.length; i++) {
      obj[list[i]] = values[i];
    }
    return obj;
  });
}
getGonghus(['202102', '202103', '202105', '201903']).then(console.log);


function fetchGonghu(yyyyMM) {
  const year = yyyyMM.slice(0, 4);
  const month = yyyyMM.slice(4, 6);
  const url = `/api/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=UAgtSMCoPNcKBH0rq%2BiiIBvdktwP3wHzjXcataapt5GCjVhWq9UquF5UiX%2FpO1%2FzJ3BVghFAncuZNvSpRIln1A%3D%3D&solYear=${year}&solMonth=${month}&_type=json`;

  return fetch(url) //공휴일 함수가 프로미스 인스턴스를 반환함. 이후 then을 통해 콜백함수 실행됨.(fetch가 프로미스를 반환하는데 이는 then이 붙은 콜백함수까지 감싸진 것임.)
    .then((response) => response.json())
    .then((result) => {
      let gonghus = result.response.body.items.item; //{dateKind: '01', dateName: '설날', isHoliday: 'Y', locdate: 20220201, seq: 1}이게 됨.

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
        result2[obj.dateName] = 1; //객체는 키가 유니크해서 똑같은 키이름으로 중복하여 만들 수 없고, 마지막걸로 덮어짐.

      } 

      return Object.keys(result2); // ['설날'] ,  ['어린이날', '부처님오신날']
      //Object.keys : 객체의 프로퍼티명(키)를 동일순서로 배열에 담아 반환함.
    });
}


