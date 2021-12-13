/**달력배열 만들기 */
//1.[{date,isWeekend,isother},{},...]만들기
export function cal(year, month) {
  let d = new Date(year, month); //2021/11/01
  let arr = [];

  //1.이전달
  let cur = new Date(d); ////2021/11/01
  let day = cur.getDay(); //1

  while (day-- > 0) {
    cur.setDate(cur.getDate() - 1);
    let isWeekend = cur.getDay() === 0 || cur.getDay() === 6;
    arr.unshift({ date: cur.getDate(), isWeekend, isOther: true });
  }

  //2.현재달
  cur = new Date(d); //11.01

  cur.setMonth(cur.getMonth() + 1); //11 (12월임)
  cur.setDate(cur.getDate() - 1); //11.30일
  let nowDate = cur.getDate(); //30

  new Array(nowDate).fill(null).forEach((_, idx) => {
    cur.setDate(idx + 1); //1,2,3,4,5,...
    let isWeekend = cur.getDay() === 0 || cur.getDay() === 6;
    arr.push({ date: idx + 1, isWeekend, isOther: false });
  });

  //3.다음달
  cur.setDate(cur.getDate() + 1); //12.01

  while (arr.length < 42) {
    let nextDate = cur.getDate(); //1,2,3,4,...
    let isWeekend = cur.getDay() === 0 || cur.getDay() === 6;
    arr.push({ date: nextDate, isWeekend, isOther: true });
    cur.setDate(cur.getDate() + 1);
  }

  //4.7일씩 자르기
  let weeks = [];

  while (arr.length > 0) {
    weeks.push(arr.splice(0, 7));
  }

  return weeks; //[[{date,isWeekend,isother},{},{},{},{},{},{}],[],[],[],[],[]]
}
