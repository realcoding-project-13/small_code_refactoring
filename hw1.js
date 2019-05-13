let today = new Date();
let firstDate = new Date(today.getFullYear(), today.getMonth(), 1);
let lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
let tData = document.getElementsByClassName('tData');
let yearmonth = document.getElementById('yearmonth');
let startCal = firstDate.getDay();
let addmodal = document.getElementById('addModal');
let chgmodal = document.getElementById('chgModal');

function init() {
    yearmonth.innerHTML = today.getFullYear() + '年 ' + (today.getMonth() + 1) + '月'; // 년월 출력

    for (i = startCal; i < lastDate.getDate() + startCal; i++) {
            setDateToCalendar(i);
            setColorToDay(i);
    }

}
function setDateToCalendar(index){
    let date = index - startCal + 1;
    tData[index].innerHTML = date;
    tData[index].classList.add('tData');
}
function setColorToDay(index){
    if (index === today.getDate() + startCal - 1 ) { // 현재
        tData[index].style.backgroundColor = '#96e3ff';
        tData[index].setAttribute('ondblclick', 'addPopup(' + i + ')');
    } else if (index < today.getDate() + startCal - 1 ) { // 지난 날
        tData[index].style.backgroundColor = '#e3e4ea';
    } else { // 남은 날
        tData[index].style.backgroundColor = '#d9e8ce';
        tData[index].setAttribute('ondblclick', 'addPopup(' + i + ')');
    }
}

function addPopup(tdNum) {
    addmodal.getElementsByTagName('p')[0].innerHTML = (tdNum - startCal + 1) + '日 일정 추가';
    addmodal.getElementsByTagName('input')[0].value = '';
    addmodal.getElementsByTagName('input')[1].setAttribute('onclick', 'addList(' + tdNum + ')');
    addmodal.style.display = "block";
}

function addList(tdNum) {
  let div = document.createElement('div');
  let schedule = addList_newSchedule();

  if(schedule){
    let btn = addList_button(tdNum);
    div.appendChild(schedule);
    div.appendChild(btn);
    tData[tdNum].appendChild(div);
  }
  closeAddBox();
}

function addList_newSchedule() {
  let inputTxt = addmodal.getElementsByTagName('input')[0].value;
  if (inputTxt !== '') {
    let p = document.createElement('input');
    p.value = inputTxt;
    return p;
  }
  return false;
}

function addList_button(tdNum) {
  let btn = document.createElement('button');
  btn.setAttribute('onclick', 'changePopup(' + tdNum + ',' + tData[tdNum].getElementsByTagName('div').length + ')');
  btn.classList.add('changeBtn');
  btn.innerHTML = '&times';
  return btn;
}

function changePopup(tdNum, listNum) {
  setChangePopupInputButton(tdNum, listNum); // 일정 변경 팝업창의 버튼 기본 값 및 이벤트 세팅
  setChangePopupButtonClickEvent(); // 버튼을 눌러 값이 변경되었을 때 동작을 세팅
}

function setChangePopupInputButton(tdNum, listNum) {
  let numberOfThisDaySchedule = tData[tdNum].getElementsByTagName('div').length;
  let originalDate = [Math.floor((tdNum - startCal + 1) / 10), (tdNum - startCal + 1) % 10];
  let fullDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + originalDate[0] + originalDate[1];
  alert(fullDate);
  let selectDateToChangeButton = chgmodal.getElementsByTagName('input')[0];
  let selectOrderToChangeButton = chgmodal.getElementsByTagName('input')[1];
  selectOrderToChangeButton.removeAttribute('disabled');

  selectDateToChangeButton.value = fullDate; // 오늘을 나타내는 값을 날짜 변경 초기 값으로 설정
  selectOrderToChangeButton.value = (listNum + 1); // 해당 날짜의 클릭한 일정의 인덱스 값이 listNum이므로 +1을 해주어 보기 쉽게함.
  selectOrderToChangeButton.setAttribute('max', numberOfThisDaySchedule); // 해당 날짜의 일정 개수를 선택가능한 max값으로 설정해줌.

  chgmodal.getElementsByTagName('input')[2].setAttribute('onclick', 'chgList(' + tdNum + ',' + listNum + ')'); // Save 버튼을 누른 경우(일정 순서 변경)
  chgmodal.getElementsByTagName('input')[3].setAttribute('onclick', 'dltList(' + tdNum + ',' + listNum + ')'); // Delete 버튼을 누른 경우(일정 삭제)
}

function setChangePopupButtonClickEvent() {
  let fullDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDay();
  let selectDateToChangeButton = chgmodal.getElementsByTagName('input')[0];
  let selectOrderToChangeButton = chgmodal.getElementsByTagName('input')[1];

  chgmodal.style.display = "block";

  window.onchange = function (event) {
      if (event.target === selectDateToChangeButton) {
          if(fullDate === selectDateToChangeButton.value ){
              selectOrderToChangeButton.removeAttribute('disabled');
          }
          else{
              selectOrderToChangeButton.setAttribute('disabled', 'true');
          }
      }
  }
}

function chgList(tdNum, listNum) {
    let chgDBtn = chgmodal.getElementsByTagName('input')[0];
    let divObj = tData[tdNum].getElementsByTagName('div')[listNum];
    let chgNum = (document.getElementById('chgModal').getElementsByTagName('input')[1].value - 1);
    let splitDate = chgDBtn.value.split('-');

    try{
      if (splitDate[0]*1 !== today.getFullYear() || splitDate[1]*1 !== (today.getMonth() + 1))
          throw "이번달이 아닌 날로 이동이 불가능합니다";

      if(splitDate[2]*1 < today.getDate())
          throw "지난 날로 이동이 불가능합니다";

      if ((tdNum - startCal + 1) !== splitDate[2]*1)
          chgListDate(splitDate[2] * 1 + startCal - 1, divObj);

      else if (listNum !== chgNum)
          chgListNum(tdNum, listNum, chgNum, divObj);

      reNumList(tdNum);
    }
    catch(e){
      alert(e);
    }

    document.getElementById('chgModal').style.display = "none";
}

function reNumList(tdNum){
  for(let i = 0; i<tData[tdNum].getElementsByTagName('div').length;i++){
      tData[tdNum].getElementsByTagName('div')[i].getElementsByTagName('button')[0].setAttribute('onclick', 'changePopup(' + tdNum + ',' + i + ')');
  }
}

function chgListDate(tdNum, divObj){
    let lastNum = tData[tdNum].getElementsByTagName('div').length - 1;

    if (lastNum === -1) {
        tData[tdNum].appendChild(divObj);
        divObj.getElementsByTagName('button')[0].setAttribute('onclick', 'changePopup(' + tdNum + ',0)');
    }
    else {
        tData[tdNum].getElementsByTagName('div')[lastNum].after(divObj);
        divObj.getElementsByTagName('button')[0].setAttribute('onclick', 'changePopup(' + tdNum + ',' + (lastNum+1) + ')');
    }


}

function chgListNum(tdNum, listNum, newNum, divObj) {
    if (newNum === 0) {
        tData[tdNum].getElementsByTagName('div')[0].before(divObj);
    }

    else if(newNum>listNum){
        tData[tdNum].getElementsByTagName('div')[newNum].after(divObj);
    }

    else {
        tData[tdNum].getElementsByTagName('div')[newNum - 1].after(divObj);
    }
}

function dltList(tdNum, listNum) {
    tData[tdNum].removeChild(tData[tdNum].getElementsByTagName('div')[listNum]);
    document.getElementById('chgModal').style.display = "none";
    for(let i = 0; i<tData[tdNum].getElementsByTagName('div').length;i++){
        tData[tdNum].getElementsByTagName('div')[i].getElementsByTagName('button')[0].setAttribute('onclick', 'changePopup(' + tdNum + ',' + i + ')');
    }
}

function closeAddBox() {
    document.getElementById('addModal').style.display = "none";
}

function closeChgBox() {
    document.getElementById('chgModal').style.display = "none";
}

window.onclick = function (event) {
    if (event.target === addModal) {
        closeAddBox();
    }
    else if (event.target === chgModal) {
        closeChgBox();
    }
};
