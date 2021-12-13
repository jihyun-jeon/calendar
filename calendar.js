/** 달력을 출력: 전달 회색표시,주말과 공휴일 빨간색 표시 */
import { cal } from './cal';
import './style.css';

function Calendar(root) {
  this.root = root;
  this.gonghuCache = {}; //cache : 이미 만들어진 데이터를 다시 만들지 않지 위해 만들어진 데이터를 저장해놓는 공간

  this.init();
  this.bindEvents();
  this.render();
}

/**
 * 1.오늘 날짜로 밑그림을 그린다(버튼,셀렉트,테이블만듦)
 */
Calendar.prototype.init = function () {
  this.date = new Date();

  let years = '';
  let curYear = this.date.getFullYear(); //2021

  for (let i = curYear - 10; i <= curYear + 10; i++) {
    if (i === curYear) {
      years += `<option selected value=${i}>${i}</option>`;
      continue;
    }

    years += `<option value=${i}>${i}</option>`;
  }

  let months = '';

  const month = this.date.getMonth();

  for (let i = 0; i < 12; i++) {
    months += `<option value="${i}" ${month === i ? 'selected' : ''}>${(i + 1)
      .toString()
      .padStart(2, '0')}</option>`;
  }

  this.root.innerHTML = `<div class="calendar">
    <span class="control">
      <button type="button" class="btn1">&lt;</button>
      <select class="year">${years}</select>
      <select class="month">${months}</select>
      <button type="button" class="btn2">&gt;</button>
    </span>
    <table>
      <thead>
        <tr><td>일</td><td>월</td><td>화</td><td>수</td><td>목</td><td>금</td><td>토</td></tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>`;

  this.tbody = this.root.querySelector('tbody');
  this.ctrl = this.root.querySelector('.control');
  this.yearEl = this.root.querySelector('.year');
  this.monthEl = this.root.querySelector('.month');
};

/**
 * 2.this.tbody에 this.date를 참고하여 cal을 호출해서. tr, td들을 그려주자.
 */
Calendar.prototype.render = function () {
  let weeks = cal(this.date.getFullYear(), this.date.getMonth()); //[[{date:31,isweek,isother},{1},{2},{3},{4},{5}],[],[],[],[]]
  let dates = '';

  for (let i = 0; i < weeks.length; i++) {
    let tds = '';

    for (let j = 0; j < weeks[i].length; j++) {
      const obj = weeks[i][j]; //{date:31,isweek,isother}

      //공휴일api호출시 나오는 날짜를 찾을 수 있도록, 클래스명에 각 td들의 날짜를 넣어주기 20190907
      let ymd =
        this.date.getFullYear().toString() +
        (this.date.getMonth() + 1).toString().padStart(2, '0') +
        obj.date.toString().padStart(2, '0');

      let cls = '_' + ymd; //클래스명에 여러개가 들어가서 따로 변수 이름을 알아보기 쉽게 만들기위해 변수로 만들어줌 //클래스명은 숫자로 시작할 수 없어서 앞에 _넣어줌.

      if (obj.isOther) {
        cls += ' isOther';
      }
      if (obj.isWeekend) {
        cls += ' isWeekend';
      }

      tds += `<td class="${cls}">${obj.date}</td>`;
      console.log(tds);
    }

    dates += `<tr>${tds}</tr>`;
  }

  this.tbody.innerHTML = dates;

  this.renderGonghu(); //렌더를 실행하면 공휴렌더도 자동으로 실행되도록(렌더가 너무 길어서 렌더랑 공휴렌더랑 분리한 것임)
};

/**
 * 3.공휴일 api를 호출해서 공휴일td에 공휴일표시 클래스를
 */
Calendar.prototype.renderGonghu = function () {
  const solYear = this.date.getFullYear().toString();
  const solMonth = (this.date.getMonth() + 1).toString().padStart(2, '0');

  const key = `${solYear}${solMonth}`;
  let data = this.gonghuCache[key];
  let promise;

  /**이미 fetch를 실행한 적이 있으면 다시 fetch로 api호출하지 않을 수 있도록 this.gonghuCache에 저장해둠 */
  if (data) {
    promise = Promise.resolve(data); //이거랑 같은거임. new Promise((resolve) => {resolve('data');}); //resolve도 프로미스를 반환함. 따라서 data(js객체)가 들어가있는 프로미스가 반환됨.
  } else {
    const url = `/api/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=UAgtSMCoPNcKBH0rq%2BiiIBvdktwP3wHzjXcataapt5GCjVhWq9UquF5UiX%2FpO1%2FzJ3BVghFAncuZNvSpRIln1A%3D%3D&solYear=${this.date.getFullYear()}&solMonth=${(
      this.date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}&_type=json`;

    promise = fetch(url)
      .then((response) => response.json()) // 프로미스 인스턴스 안에 자바스크립트 객체로 나옴
      .then((data) => {
        //data = {response: {…}}임
        this.gonghuCache[key] = data;
        //console.log(this.gonghuCache);
        return data;
      });
  }

  promise.then((result) => {
    //result는 순수js 객체가 됨.
    //console.log(result.response.body.items.item); //{dateKind: '01', dateName: '기독탄신일', isHoliday: 'Y', locdate: 20211225, seq: 1}
    // 1. items: {item: [{}, {}]} <-공휴일이 여러개 일때
    // 2. items: {item: {}},  <-공휴일이 1개일때
    // 3. items: ""  <-공휴일이 없을떄

    let gonghus = result.response.body.items.item; //{dateKind: '01', dateName: '설날', isHoliday: 'Y', locdate: 20220201, seq: 1}이게 됨.

    if (!gonghus) {
      //undefinde가 true가 됨.
      return;
    }

    let arr = [];

    if (!Array.isArray(gonghus)) {
      arr = [gonghus];
    } else {
      arr = gonghus;
    }

    arr.forEach((el) => {
      let gonghuTd = this.tbody.querySelector(`._${el.locdate}`); //공휴일 날짜가 있는 td를 찾음.
      if (gonghuTd) {
        gonghuTd.classList.add('isHoliday'); //이후 그 td에 클래스를 넣어주는 것임. //setattribute를 쓰면 기존에 있는 클래스 속정이 다 없어지고 새로 덮어져서.
        gonghuTd.setAttribute('title', el.dateName); ///setattribute를 해도 처음 등록하는 속성이여서 위에 class처럼 속성이 초기화 되지 않음
        //title : html의 속성임
      }
    });
  });
};

/**
 * 4.이벤트를 할당하기
 */
Calendar.prototype.bindEvents = function () {
  const ctrl = this.ctrl;

  //option 바꿀떄 이벤트
  ctrl.addEventListener('change', () => {
    this.date = new Date(+this.yearEl.value, +this.monthEl.value);
    this.render();
  });

  //버튼 누를시 이벤트
  ctrl.addEventListener('click', (e) => {
    //select를 눌렀을때도 이벤트가 반응해서 막아주기 위한 코드
    if (e.target.nodeName !== 'BUTTON') {
      return;
    }

    let clickDate = new Date(this.date); //따로 뉴데이트 새로 만들지 말고, 기존에 있는 this.date를 써도 됨.

    if (e.target.className === 'btn1') {
      clickDate.setMonth(clickDate.getMonth() - 1);
    }
    if (e.target.className === 'btn2') {
      clickDate.setMonth(clickDate.getMonth() + 1);
    }

    this.date = clickDate; //render함수에서 this.date를 이용하기 때문에 다시 this.date에 집어넣어줌.

    //select를 바꾸기 전에 2032년 이상이면 render를 멈추게 함.
    if (this.date.getFullYear() >= 2032) {
      alert('출력할 수 없습니다.');
      this.date = new Date(2031, 11); //질문?? render을 왜 또 안하는지????
      return;
    }
    this.render();

    this.yearEl.value = this.date.getFullYear();
    this.monthEl.value = this.date.getMonth();
  });
};

const calendar = new Calendar(document.querySelector('#app'));
