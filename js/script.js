let myScreenData = {};

//=================== 스토리지 ======================
getStorage();

function saveStorage() {
    localStorage.setItem('myScreenData', JSON.stringify(myScreenData));
}

function getStorage() {
    const storedData = localStorage.getItem('myScreenData');
    if (storedData) {
        myScreenData = JSON.parse(storedData);
    }
}

//================== 명언 타이핑 ====================
const quotes = [
    { content: '행복은 성격이 아니라 습관이다.', author: '위대한 가르침' },
    { content: '시간은 누구에게나 공평하다. 시간을 어떻게 쓰느냐가 중요하다.', author: '로버트 하인라인' },
    { content: '시작이 반이다. 시작하라.', author: '아리스토텔레스' },
    { content: '변화는 두려운 것이 아니다. 변화를 받아들이면 된다.', author: '엘리너 루스벨트' },
    { content: '자신이 사랑하는 일을 하세요. 그 일이 당신을 행복하게 할 것이다.', author: '마크 트웨인' },
    // ...other quotes
];
let isTyping = false; // 명언 타이핑 중 여부를 추적하는 플래그
function displayRandomQuote() {
    if (isTyping) return; // 이미 타이핑 중인 경우 함수 종료
    isTyping = true; // 타이핑 시작
    const { content, author } = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteText = `${content} - ${author}`;
    const eleDrawSay = document.querySelector('.draw_say');
    let index = 0;
    eleDrawSay.classList.add('cursor_show');
    eleDrawSay.textContent = '';
    qouteUpdate(eleDrawSay, quoteText, index);
}
//명언 반복 출력을 위한 재귀함수
let qouteTimer;
function qouteUpdate(eleDrawSay, quoteText, index) {
    eleDrawSay.textContent += quoteText[index];
    index++;
    if (index >= quoteText.length) {
        clearTimeout(qouteTimer);
        setTimeout(() => eleDrawSay.classList.add('cursor_hide'), 1500);
        isTyping = false; // 타이핑 종료
    } else {
        qouteTimer = setTimeout(() => qouteUpdate(eleDrawSay, quoteText, index), 140);
    }
}

//======================= 시계 ====================
function updateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const day = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];

    const hours = now.getHours() % 12 || 12;

    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = now.getHours() >= 12 ? '오후' : '오전';
    document.querySelector('.draw_time').textContent = `${ampm} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.querySelector('.draw_date').textContent = `${month}월 ${date}일 ${day}요일`;
}

//======================= 날씨 ====================
async function updateWeather() {
    const apiKey = 'f66b13dcadd6f056d8dea5ea8d68eed7';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Daegu,KR&appid=${apiKey}&units=metric`);
    const data = await response.json();
    document.querySelector('.mmt_weather').innerHTML = `
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="weather icon">
        <span class="temp">${data.main.temp}°C</span>
        <p class="region">(${data.name === 'Daegu' ? '대구' : data.name})</p>
    `;
}

//=================== 이름과 인사말 조합 ======================
function getGreetingMessage() {
    const hours = new Date().getHours();
    if (hours >= 7 && hours < 9) return '좋은 아침입니다.';
    if (hours >= 9 && hours < 12) return '오전에 힘내세요';
    if (hours >= 12 && hours < 13) return '점심 맛있게 먹었나요';
    if (hours >= 13 && hours < 18) return '오후에는 좀 쉬면서 해요.';
    if (hours >= 18 && hours < 24) return '가족과 함께 멋진 저녁보내세요';
    return '잠 좀 자라';
}

//=============== 인사말 타이핑 ====================
function displayGreetTyping() {
    const eleGreet = document.querySelector('.draw_greet');
    const greetText = `${myScreenData.name}님, ${getGreetingMessage()}`;
    let index = 0;
    eleGreet.classList.add('cursor_show');
    eleGreet.textContent = '';
    greetUpdate(eleGreet, greetText, index);
}
//인사말 반복출력을 위한 재귀함수 구현
let greetTimer;
function greetUpdate(eleGreet, greetText, index) {
    eleGreet.textContent += greetText[index++];
    if (index >= greetText.length) {
        clearTimeout(greetTimer);
        setTimeout(() => eleGreet.classList.add('cursor_hide'), 1000);
    } else {
        greetTimer = setTimeout(() => greetUpdate(eleGreet, greetText, index), 140);
    }
}

//======================= 목표 ====================
const goalParentDiv = document.querySelector('#mmt_goal');
const goalInput = document.querySelector('#iptGoal');
const saveGoalBtn = document.querySelector('#btnSaveGoal');
//---------------

function saveGoal() {
    const goal = goalInput.value.trim();
    if (!goal) {
        alert('오늘의 목표 내용을 작성해주세요');
        goalInput.focus();
        return;
    }
    myScreenData.goalArray.push({ title: goal, done: false });
    goalInput.value = '';
    saveStorage();
    renderGoalList();
}

goalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveGoal();
});
saveGoalBtn.addEventListener('click', saveGoal);

function renderGoalList() {
    const goalList = document.querySelector('#goalList');
    goalList.innerHTML = '';
    myScreenData.goalArray.forEach((item, index) => {
        const { title, done } = item;
        const li = document.createElement('li');
        li.className = done ? 'isDone' : '';
        li.innerHTML = `
            <span class="chk_wrap">
                <input type="checkbox" id="isDoneChk${index}" ${done ? 'checked' : ''}/>
                <label for="isDoneChk${index}"><span class="txt">선택</span></label>
            </span>
            <span class="goal_title" title="${title}">${title}</span>
            <span class="goal_btn_wrap">
                <button type="button" class="del_btn" id="deleteGoal${index}" title="삭제"><i class="fa-regular fa-trash-can"></i></button>
            </span>
        `;
        li.querySelector(`#isDoneChk${index}`).addEventListener('change', () => {
            myScreenData.goalArray[index].done = !myScreenData.goalArray[index].done;
            saveStorage();
            renderGoalList();
        });
        li.querySelector(`#deleteGoal${index}`).addEventListener('click', () => {
            myScreenData.goalArray.splice(index, 1);
            saveStorage();
            renderGoalList();
        });
        goalList.appendChild(li);
    });
}

//======================= 키워드 ====================
const namingKeywords = [
    'getUserData',
    'setUserName',
    'fetchData',
    'calculateTotal',
    'updateRecord',
    'deleteItem',
    'validateInput',
    'renderPage',
    'handleClick',
    'submitForm',
    // ...other keywords
];

function displayRandomKeyword() {
    const eleKeyword = document.querySelector('.draw_namming');
    updateKeyword(eleKeyword);
}
//키워드 반복 출력을 위한 재귀함수 구현
function updateKeyword(eleKeyword) {
    eleKeyword.textContent = namingKeywords[Math.floor(Math.random() * namingKeywords.length)];
    eleKeyword.style.opacity = 1;
    eleKeyword.style.transform = 'scale(1)';

    setTimeout(() => {
        eleKeyword.style.opacity = 0;
        eleKeyword.style.transform = 'scale(0.9)';
    }, 3200);
    setTimeout(() => updateKeyword(eleKeyword), 5000);
}

//=================== 이름 작성 ======================
const eleBackdropScreen = document.querySelector('.backdrop_screen');
const eleBackdropScreenNameWrite = document.querySelector('.backdrop_screen .name_write');
const eleYourNameInput = document.querySelector('#yourName');
const eleNameSubmitBtn = document.querySelector('#nameSubmit');

function handleNameSubmit() {
    const name = eleYourNameInput.value.trim();
    if (!name) {
        alert('이름을 입력해주세요');
        eleYourNameInput.focus();
        return;
    }

    //초기 필수 데이터 생성 및 스토리지에 저장
    myScreenData.name = name;
    myScreenData.goalArray = [];
    saveStorage();

    //이름 작성 후 이름작성 ui 사라짐
    eleBackdropScreenNameWrite.style.bottom = '100%';
    document.querySelector('.img_top').style.transition = 'opacity 1s ease-in-out';
    document.querySelector('.img_top').style.opacity = 0;

    setTimeout(() => {
        eleYourNameInput.value = '';
        eleBackdropScreen.style.opacity = '0';
    }, 800);
    setTimeout(() => {
        eleBackdropScreen.style.display = 'none';
        initializeApp();
    }, 1500);
}

//엔터 이벤트 리스너
eleYourNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleNameSubmit();
});
//클릭 이벤트 리스너
eleNameSubmitBtn.addEventListener('click', handleNameSubmit);

// ==================================================
// ==================================================
// ==================================================

//======================= 초기화 ====================
function initializeApp() {
    setTimeout(() => {
        displayRandomKeyword();
        displayGreetTyping();
    }, 1500);

    //재귀함수 구현
    function updateBackgroundImage() {
        setAfterRandomBackgroundImage();
        setTimeout(updateBackgroundImage, 20000);
    }
    updateBackgroundImage();

    //재귀함수 구현
    function clockUpdate() {
        updateClock();
        setTimeout(clockUpdate, 1000);
    }
    clockUpdate();

    //재귀함수 구현
    function weatherUpdate() {
        updateWeather();
        setTimeout(weatherUpdate, 600000);
    }
    weatherUpdate();

    renderGoalList();

    setTimeout(() => {
        document.querySelector('.mmt_weather').classList.add('on');
        document.querySelector('.right_group').classList.add('on');
        document.querySelector('.left_group').classList.add('on');
    }, 300);
}

// ==================================================
// ==================================================
// ==================================================

//============== 초기 로드 후 실행 ==================

window.addEventListener('DOMContentLoaded', () => {
    if (!myScreenData.name) {
        firstNameSettingRandomBackgroundImage();

        eleBackdropScreen.style.display = 'flex';
        eleBackdropScreen.style.opacity = '0';
        setTimeout(() => {
            eleBackdropScreen.style.opacity = '1';
        }, 2000);
        setTimeout(() => {
            eleBackdropScreenNameWrite.style.bottom = '0';
        }, 3000);

        //focus  때문에 화면강제 이동되는것을 회피하기위해 transitionend 에 사용함
        eleBackdropScreenNameWrite.addEventListener('transitionend', () => {
            eleYourNameInput.focus();
        });
    } else {
        initializeApp();
    }
});

//================ 배경이미지 랜덤 ===================
//let firstView = true;
const imgData = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'bg6.jpg', 'bg7.jpg', 'bg8.jpg', 'bg9.jpg', 'bg10.jpg', 'bg11.jpg', 'bg12.jpg', 'bg13.jpg', 'bg14.jpg', 'bg15.jpg', 'bg16.jpg', 'bg17.jpg', 'bg18.jpg', 'bg19.jpg', 'bg20.jpg', 'bg21.jpg', 'bg22.jpg', 'bg23.jpg', 'bg24.jpg', 'bg25.jpg', 'lake.jpg', 'mountain.jpg'];

function firstNameSettingRandomBackgroundImage() {
    const imageUrl = `./images/${imgData[Math.floor(Math.random() * imgData.length)]}`;
    const imgTop = document.querySelector('.img_top');
    const imgBottom = document.querySelector('.img_bottom');

    const img = new Image();
    img.onload = () => {
        imgTop.style.transition = 'opacity 1.5s ease-in-out';
        imgTop.style.opacity = 1;
        imgTop.style.backgroundImage = `url(${imageUrl})`;
    };
    img.src = imageUrl;
}

let firstTime = true;
function setAfterRandomBackgroundImage() {
    const imageUrl = `./images/${imgData[Math.floor(Math.random() * imgData.length)]}`;
    const imgTop = document.querySelector('.img_top');
    const imgBottom = document.querySelector('.img_bottom');

    const img = new Image();
    img.onload = () => {
        imgTop.style.transition = firstTime ? 'opacity 1.5s ease-in-out' : 'opacity 5s ease-in-out';
        firstTime = false;
        imgTop.style.opacity = 1;
        imgTop.style.backgroundImage = `url(${imageUrl})`;

        setTimeout(() => {
            imgTop.style.opacity = 0;
            imgBottom.style.backgroundImage = `url(${imageUrl})`;
        }, 10000);

        setTimeout(() => {
            document.querySelector('.draw_say').classList.remove('cursor_hide');
            document.querySelector('.draw_say').classList.add('cursor_show');
            displayRandomQuote();
        }, 5500);
    };
    img.src = imageUrl;
}
