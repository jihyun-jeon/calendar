/**달력출력-공휴일 없이 */
//[[module syntax기법]] <- <script type="module" src="/main.js"></script> , 크롬에만 된다.
import './style.css'; //css는 export안하고 바로 import할 수 있음
import { cal } from './cal';

//<model>
let appEl = document.querySelector('#app');
let year = new Date().getFullYear(); //2021
let month = new Date().getMonth(); //11

//<view>
//1.달력출력
function render() {
  let weeks = cal(year, month); //[[{date:31,isweek,isother},{1},{2},{3},{4},{5}],[],[],[],[]]
  let idx = '';

  for (let i = 0; i < weeks.length; i++) {
    let tds = '';
    for (let j = 0; j < weeks[i].length; j++) {
      if (weeks[i][j].isOther) {
        tds += `<td class="isOther">${weeks[i][j].date}</td>`;
        continue;
      }
      if (weeks[i][j].isWeekend) {
        tds += `<td class="isWeekend">${weeks[i][j].date}</td>`;
        continue;
      }
      tds += `<td>${weeks[i][j].date}</td>`;
    }
    idx += `<tr>${tds}</tr>`;
  }

  appEl.innerHTML = `<table>
<thead>
  <tr><td>일</td><td>월</td><td>화</td><td>수</td><td>목</td><td>금</td><td>토</td></tr>
</thead>
<tbody>
  ${idx}
</tbody>
</table>`;
}
render();

//2.select출력
let yearEl = document.querySelector('#year');
let yearIdx = '';

let curYear = new Date().getFullYear(); //2021

for (let i = curYear - 10; i <= curYear + 10; i++) {
  if (i === curYear) {
    yearIdx += `<option selected value=${i}>${i}</option>`;
    continue;
  } else {
    yearIdx += `<option value=${i}>${i}</option>`;
  }
}
yearEl.innerHTML = yearIdx;

let monthEl = document.querySelector('#month');
let monthIdx = '';

for (let i = 0; i < 12; i++) {
  monthIdx += `<option value="${i}" ${month === i ? 'selected' : ''}>${(i + 1)
    .toString()
    .padStart(2, '0')}</option>`;
}
monthEl.innerHTML = monthIdx;

//<control>
let ctr = document.querySelector('#control');

//select를 change하면 달력이 바뀌는 이벤트
ctr.addEventListener('change', () => {
  year = yearEl.value;
  month = monthEl.value;
  render();
});

//btn을 클릭하면 달력이 바뀌는 이벤트
ctr.addEventListener('click', (e) => {
  //select를 눌렀을때도 이벤트가 반응해서 막아주기 위한 코드
  if (e.target.nodeName !== 'BUTTON') {
    return;
  }

  let clickDate = new Date(year, month);

  if (e.target.className === 'btn1') {
    clickDate.setMonth(clickDate.getMonth() - 1);
  }
  if (e.target.className === 'btn2') {
    clickDate.setMonth(clickDate.getMonth() + 1);
  }

  year = clickDate.getFullYear();
  month = clickDate.getMonth();

  if (year >= 2032) {
    alert('출력할 수 없습니다.');
    year = 2031;
    month = 11;
    return;
  }
  render();
  //select를 바꾸기 전에 2032년 이상이면 render를 멈추게 함.

  monthEl.value = month;
  yearEl.value = year;
});
