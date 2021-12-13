/**공휴일 리스트로 만들기 */
let appEl = document.querySelector('#app');

//초기값 렌더(select의 옵션, ol 까지)
appEl.innerHTML = `  <h2>공휴일 조회</h2>
<span class="control">
  <select class="year">
  </select>
  <select class="month">
  </select>
</span>
<button type="button">조회</button>
<h2>목록!</h2>
<ol class="list"></ol>`;

let yearEl = document.querySelector('.year');
let years = '';
for (let i = 2019 - 3; i <= 2019 + 3; i++) {
  years += `<option ${
    i === new Date().getFullYear() ? 'selected' : ''
  } value=${i}>${i}</option>`;
}
yearEl.innerHTML = years;

let monthEl = document.querySelector('.month');
let months = '';
for (let i = 1; i <= 12; i++) {
  months += `<option ${
    i === new Date().getMonth() + 1 ? 'selected' : ''
  } value=${i.toString().padStart(2, '0')}>${i
    .toString()
    .padStart(2, '0')}</option>`;
}
monthEl.innerHTML = months;

//select에 이벤트 걸기
let btnEl = document.querySelector('button');
let listEl = document.querySelector('.list');

btnEl.addEventListener('click', () => {
  const url = `/api/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=UAgtSMCoPNcKBH0rq%2BiiIBvdktwP3wHzjXcataapt5GCjVhWq9UquF5UiX%2FpO1%2FzJ3BVghFAncuZNvSpRIln1A%3D%3D&solYear=${yearEl.value}&solMonth=${monthEl.value}&_type=json`;

  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      // 1. items: {item: [{}, {}]}
      // 2. items: {item: {}},
      // 3. items: ""
      let gonghus = result.response.body.items.item;

      if (!gonghus) {
        listEl.innerHTML = `<li>공휴일이 없습니다.</li>`;
        return;
      }

      let arr = '';
      if (!Array.isArray(gonghus)) {
        arr = [gonghus];
      } else {
        arr = gonghus;
      }

      let lis = '';
      arr.forEach((el) => {
        let d = el.locdate.toString();
        lis += `<li>${el.dateName}(${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(
          6,
          8
        )})</li>`;
      });

      listEl.innerHTML = lis;
    });
});
