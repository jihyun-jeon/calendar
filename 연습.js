import { cal } from './cal';
import './style.css';

function Calendar(root) {
this.root = root;
this.gonghuCache = {}; //cache : 이미 만들어진 데이터를 다시 만들지 않지 위해 만들어진 데이터를 저장해놓는 공간


this.init();
this.render();
}


/**
 * 1.오늘 날짜로 밑그림을 그린다(버튼,셀렉트,테이블만듦)
 */
Calendar.prototype.init = function(){
  this.date = new Date();

  let year = "";
  let curYear = this.date.getFullYear();
  for(let i = curYear-10; i <curYear+10; i++){
    year += `<option ${i===curYear ?"selected" :""} value=${i}>${i}</option>`;
  }

  let month = "";
  let curMonth = this.date.getMonth();
  for(let i =1; i <=12; i++){
    month += `<option ${i===curMonth ?"selected" :""} value=${i}>${(i+1).toString().padStart(2,"0")}</option>`;
  }

  this.root.innerHTML = `
  <div class="calendar">
      <span class="control">
        <button type="button" class="btn1">&lt</button>
        <select class="year">${year}</select>
        <select class="month">${month}</select>
        <button type="button" class="btn2">&gt</button>
      </span>
      <table>
        <thead>
          <tr><td>일</td><td>월</td><td>화</td><td>수</td><td>목</td><td>금</td><td>토</td></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  `;

  this.tbody = this.root.querySelector("tbody");
  this.ctrl = this.root.querySelector("control");
  this.yearEl = this.root.querySelector("year");
  this.monthEl = this.root.querySelector("month");
}


/**
 * 2.this.tbody에 this.date를 참고하여 cal을 호출해서. tr, td들을 그려주자.
 */

Calendar.prototype.render=function(){
 let weeks = cal(this.date.getFullYear(),this.date.getMonth()); 
 //[[{date:31,isweek,isother},{1},{2},{3},{4},{5}],[],[],[],[]]
 let dates = "";

for(let i =0; i< weeks.length; i++){
let tds = "";
  for(let j=0; j < weeks[i].length; j++){
    const obj = weeks[i][j];

    let ymd = 
    this.date.getFullYear().toString()+
    (this.date.getMonth()+1).toString().padStart(2,"0")+
    obj.date.toString().padStart(2,"0");

    let cls = "_"+ymd; 

    if(obj.isOther){
      cls += " isOther";
    }

     if(obj.isWeekend){
      cls += " isWeekend";
      }
   tds += `<td class="${cls}">${obj.date}</td>`;
  } 
  dates += `<tr>${tds}</tr>`;
}

this.tbody.innerHTML = dates;
this.renderGonghu();
};

/**
 * 3.공휴일 api를 호출해서 공휴일td에 공휴일표시 클래스를
 */
Calendar.prototype.renderGonghu = function(){
let solYear = this.date.getFullYear();
let solMonth = this.date.getMonth().toString().padStart(2,"0");

const key = `${solYear}${solMonth}`;
let data = this.gonghuCache[key];
let promise;

if(data){

}else{
  const url =  `/api/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?serviceKey=UAgtSMCoPNcKBH0rq%2BiiIBvdktwP3wHzjXcataapt5GCjVhWq9UquF5UiX%2FpO1%2FzJ3BVghFAncuZNvSpRIln1A%3D%3D&solYear=${this.date.getFullYear()}&solMonth=${(
    this.date.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}&_type=json`;

}



}



const c1 = new Calendar(document.querySelector("#app"));