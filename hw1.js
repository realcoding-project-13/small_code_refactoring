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
    let dateForIteration = today.getDate() + startCal - 1 ;
    if (index === dateForIteration) { // 현재
        tData[index].style.backgroundColor = '#96e3ff';
        tData[index].setAttribute('ondblclick', 'addPopup(' + i + ')');
    } else if (index < dateForIteration) { // 지난 날
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
    let tempM = [Math.floor((today.getMonth() + 1) / 10), (today.getMonth() + 1) % 10];
    let tempD = [Math.floor((tdNum - startCal + 1) / 10), (tdNum - startCal + 1) % 10];
    let listLength = tData[tdNum].getElementsByTagName('div').length;
    let fullDate = today.getFullYear() + "-" + tempM[0] + tempM[1] + "-" + tempD[0] + tempD[1];
    let chgDBtn = chgmodal.getElementsByTagName('input')[0];
    let chgLBtn = chgmodal.getElementsByTagName('input')[1];
    chgLBtn.removeAttribute('disabled');

    chgDBtn.value = fullDate;
    chgLBtn.value = (listNum + 1);
    chgLBtn.setAttribute('max', listLength);
    chgmodal.getElementsByTagName('input')[2].setAttribute('onclick', 'chgList(' + tdNum + ',' + listNum + ')');
    chgmodal.getElementsByTagName('input')[3].setAttribute('onclick', 'dltList(' + tdNum + ',' + listNum + ')');

    chgmodal.style.display = "block";

    window.onchange = function (event) {
        if (event.target === chgDBtn) {
            if(fullDate === chgDBtn.value ){
                chgLBtn.removeAttribute('disabled');
            }
            else{
                chgLBtn.setAttribute('disabled', 'true');
            }
        }
    }
}

function chgList(tdNum, listNum) {
    let chgDBtn = chgmodal.getElementsByTagName('input')[0];
    let divObj = tData[tdNum].getElementsByTagName('div')[listNum];
    let chgNum = (document.getElementById('chgModal').getElementsByTagName('input')[1].value - 1);
    let splitDate = chgDBtn.value.split('-');

    if (splitDate[0]*1 !== today.getFullYear() || splitDate[1]*1 !== (today.getMonth() + 1)) {
        alert("이번달이 아닌 날로 이동이 불가능합니다");
    }

    else if ((tdNum - startCal + 1) !== splitDate[2]*1){
        if (splitDate[2]*1 < today.getDate()){
            alert("지난 날로 이동이 불가능합니다");
        }
        else {
            chgListDate(splitDate[2] * 1 + startCal - 1, divObj);

            for (let i = 0; i < tData[tdNum].getElementsByTagName('div').length; i++) {
                tData[tdNum].getElementsByTagName('div')[i].getElementsByTagName('button')[0].setAttribute('onclick', 'changePopup(' + tdNum + ',' + i + ')');
            }
        }
    }

    else if (listNum !== chgNum) {
        chgListNum(tdNum, listNum, chgNum, divObj);

        for(let i = 0; i<tData[tdNum].getElementsByTagName('div').length;i++){
            tData[tdNum].getElementsByTagName('div')[i].getElementsByTagName('button')[0].setAttribute('onclick', 'changePopup(' + tdNum + ',' + i + ')');
        }
    }

    document.getElementById('chgModal').style.display = "none";
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
