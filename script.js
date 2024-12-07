// 변수 선언 부분
var isPlay = false; // 게임의 시작을 알리는 변수.
// 이미지들의 경로 배열
var imageArr = [];
var successCount = 0;
var statusEl = document.getElementById('status');
var template_cell = document.getElementById("template_cell");
var txtCell = template_cell.innerHTML;
var puzzle = document.getElementById("puzzle");
var txtCells = "";

for (var i = 0; i < 16; i++) {
    txtCells += txtCell;
}
puzzle.innerHTML = txtCells;
var cells = document.getElementsByClassName("cell");

// The Cat API에서 랜덤 이미지를 8개 가져와서 imageArr 배열을 채운다.
function loadCatImages() {
    const apiUrl = 'https://api.thecatapi.com/v1/images/search?limit=8&api_key=live_XHaN4nSy2yxP25FETsdzyOIr7L9ckWG4gYlV6VEpdYeFn5kCFaRHBerWSnGkq00a';

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            // 가져온 이미지 URL을 imageArr 배열에 채운다
            imageArr = data.map(item => item.url);
            // 이미지를 셀에 넣고 셀 섞기 함수 실행
            populateCellsCat();
        })
        .catch((error) => {
            console.error('API 요청 실패:', error);
        });
}

function loadDogImages() {
    const numImages = 8; // 불러올 이미지 수
    const imagePromises = []; // 이미지 URL을 저장할 배열

    // 이미지 요청을 보내는 함수
    function requestImage() {
        const apiUrl = 'https://random.dog/woof.json'; // 이미지 URL을 반환하는 API
        return fetch(apiUrl)
            .then((response) => response.json()) // JSON 응답을 처리
            .then((data) => {
                if (data.url) {
                    return data.url; // 이미지 URL 반환
                } else {
                    return null; // URL이 없으면 null 반환
                }
            })
            .catch((error) => {
                console.error('이미지 요청 실패:', error);
                return null; // 오류 발생 시 null 반환
            });
    }

    // 여러 개의 이미지를 요청하는 비동기 함수
    const imageFetchPromises = [];
    for (let i = 0; i < numImages; i++) {
        imageFetchPromises.push(requestImage()); // 이미지 요청을 Promise 배열에 추가
    }

    // 모든 이미지 요청이 완료되면 `populateCells()` 실행
    Promise.all(imageFetchPromises)
        .then((results) => {
            // 유효한 이미지 URL만 필터링하여 imageArr에 할당
            imageArr = results.filter((url) => url !== null);
            console.log('불러온 이미지 경로:', imageArr);

            // 이미지가 정확히 8개인 경우만 처리하도록 추가 검증
            if (imageArr.length === numImages) {
                populateCellsCat(); // 셀에 이미지를 넣고 셀을 섞음
            } else {
                console.error(`이미지 요청에 실패하여 ${numImages - imageArr.length}개가 부족합니다. 다시 시도해 주세요.`);
                // 부족한 이미지 수만큼 재요청 시도
                loadDogImages();
            }
        })
        .catch((error) => {
            console.error('이미지 요청 중 오류가 발생했습니다.', error);
        });
}

function populateCellsCat() {
    // 각각 셀에 0~7까지의 텍스트와 이미지를 넣는다..
    for (var i = 0; i < cells.length; i++) {
        var numLabel = cells[i].getElementsByTagName("li")[1];
        numLabel.innerHTML = '<img src="' + imageArr[i % (cells.length / 2)] + '">' +
            i % (cells.length / 2);
    }

    // 셀의 숫자를 섞어준다.
    for (var cnt = 0; cnt < 50; cnt++) {
        var i = Math.floor(Math.random() * 16);
        var j = Math.floor(Math.random() * 16);
        var iLabel = cells[i].getElementsByTagName("li")[1];
        var jLabel = cells[j].getElementsByTagName("li")[1];
        var tmp = iLabel.innerHTML;
        iLabel.innerHTML = jLabel.innerHTML;
        jLabel.innerHTML = tmp;
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].getElementsByTagName("ul")[0].style.left = "0px";
    }
}

function start() {
    var StartCount = Math.floor(Math.random() * 2);
    if (StartCount == 0)
    {
        loadCatImages(); // 고양이 이미지 로딩 함수 호출
    }
    else if(StartCount == 1)
    {
        loadDogImages();
    }
    intro01();
}

var intro01 = function intro_01() {
    // 첫번째 인트로
    var performCnt = 0;
    var interval_f1 = setInterval(function() {
        var cell_ul = cells[performCnt].getElementsByTagName("ul")[0];
        cell_ul.style.left = "-100px";
        performCnt++;
        if(performCnt == 16) {
            intro_02();
            statusEl.innerText = "성공하길 바래 :)"
            clearInterval(interval_f1);
        }
    }, 100);
}

function intro_02() {
    // 두번째 쑈
    var performCnt = 0;
    var i = 0;
    var j = 0;
    var interval_f2 = setInterval(function() {
        var cell_ul = cells[i + j*4].getElementsByTagName("ul")[0];
        cell_ul.style.left = "0px";
        performCnt++;
        j++;
        if(j == 4) {
            i++;
            j = 0;
        }
        if(performCnt == 16) {
            intro_03();
            statusEl.innerText = "Are You Ready?"
            clearInterval(interval_f2);
        }
    }, 100);
}

function intro_03() {
    var i = 15;
    var interval_f3 = setInterval(function() {
        console.log(i);
        cells[i--].getElementsByTagName("ul")[0].style.left = "-100px";
        console.log(i);
        cells[i--].getElementsByTagName("ul")[0].style.left = "-100px";
        console.log(i);
        cells[i--].getElementsByTagName("ul")[0].style.left = "-100px";
        console.log(i);
        cells[i--].getElementsByTagName("ul")[0].style.left = "-100px";
        if(i == -1) {
            intro_04();
            clearInterval(interval_f3);
        }
    }, 200);

}
function intro_04() {
    // 1초에 함번씩 콜백함수 기능을 반복한다.
    var count = 4;
    var intervalRef = setInterval(function() {
        count--;
        if(count == 0) {
            clearInterval(intervalRef);
            statusEl.innerText = "Go!";
            // 함수 호출 부분
            for(var i=0; i<cells.length; i++) {
                setEventHandler(cells[i]);
            }
            isPlay = true;
            return;
        }
        statusEl.innerText = count;
    }, 1000);

    // 5초 후에 전체 감춰주기
    setTimeout(function() {
        for(var i=0; i<cells.length; i++) {
            // $(cells[i]).trigger('click');
            showHideLabel(cells[i]);
        }
    }, 4000);
}


// 각각 셀에 이벤트 등록
// 함수 선언 부분
function showHideLabel(cell) {
    var ulTag = cell.getElementsByTagName("ul")[0];
    if(ulTag.style.left == '0px') {
        ulTag.style.left = '-100px';
    } else {
        ulTag.style.left = '0px';
    }
}

var tmpCell = null;
function setEventHandler(cell) {
    cell.addEventListener('click',  function() {
        // 규칙 유효성 check
        if(isPlay) {
            if(tmpCell == null) {
                statusEl.innerText = "";
                tmpCell = this;
            } else {
                if(tmpCell == this) {
                    statusEl.innerText = "같은 셀을 두번 선택했습니다."
                    return;
                }
                // 게임 판정 부분
                var check_1 = tmpCell.getElementsByTagName("li")[1].innerText;
                var check_2 = this.getElementsByTagName("li")[1].innerText;

                // 성공했을때
                if(check_1 == check_2) {
                    statusEl.innerText = "Great!!";
                    successCount++;
                    if(successCount == 8) {
                        finish();
                    }
                } else { // 틀렸을때
                    statusEl.innerText = "Wrong!";
                    // 다시뒤집기
                    var cell_1 = tmpCell.getElementsByTagName("ul")[0];
                    var cell_2 = this.getElementsByTagName("ul")[0];
                    // showHideLabel(this);
                    cell_2.style.left = "-100px"; 

                    //1.5초 후에 다시 감추기 (0px)
                    setTimeout(function() {
                        cell_1.style.left = "0px"; 
                        cell_2.style.left = "0px"; 
                        clearInterval();
                        return;
                    }, 1000);
                    

                    tmpCell = null;
                    return;
                }
                
                tmpCell = null;
            }
            showHideLabel(this);
        }
    }, true);
    $(cell).trigger('click');

}
function finish() {
    var cnt = 0;
    var flag = true;

    var finish_evt1 = setInterval(function(){
        if(flag) {
            cells[0].getElementsByTagName("ul")[0].style.left = "0px";
            cells[2].getElementsByTagName("ul")[0].style.left = "0px";
            cells[5].getElementsByTagName("ul")[0].style.left = "0px";
            cells[7].getElementsByTagName("ul")[0].style.left = "0px";
            cells[8].getElementsByTagName("ul")[0].style.left = "0px";
            cells[10].getElementsByTagName("ul")[0].style.left = "0px";
            cells[13].getElementsByTagName("ul")[0].style.left = "0px";
            cells[15].getElementsByTagName("ul")[0].style.left = "0px";
            cells[1].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[3].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[4].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[6].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[9].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[11].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[12].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[14].getElementsByTagName("ul")[0].style.left = "-100px";
            statusEl.innerText = "";
            flag = false;
            cnt++;
        } else {
            cells[0].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[2].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[5].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[7].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[8].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[10].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[13].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[15].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[1].getElementsByTagName("ul")[0].style.left = "0px";
            cells[3].getElementsByTagName("ul")[0].style.left = "0px";
            cells[4].getElementsByTagName("ul")[0].style.left = "0px";
            cells[6].getElementsByTagName("ul")[0].style.left = "0px";
            cells[9].getElementsByTagName("ul")[0].style.left = "0px";
            cells[11].getElementsByTagName("ul")[0].style.left = "0px";
            cells[12].getElementsByTagName("ul")[0].style.left = "0px";
            cells[14].getElementsByTagName("ul")[0].style.left = "0px";
            statusEl.innerText = "congratulation!!!!";
            flag = true;
            cnt++;
        }
        if(cnt == 10) {
            cells[1].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[3].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[4].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[6].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[9].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[11].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[12].getElementsByTagName("ul")[0].style.left = "-100px";
            cells[14].getElementsByTagName("ul")[0].style.left = "-100px";
            clearInterval(finish_evt1);
            return;
        }
    }, 500);
     
}