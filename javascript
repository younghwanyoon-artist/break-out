const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');//2차원

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;
const delay = 500; //delay to reset the game

// Create ball props
const ball = {
  x: canvas.width / 2, //400 //Start point
  y: canvas.height / 2, //300 //Start point
  size: 10,
  speed: 10,
  dx: 4,
  dy: -4,
  visible: true
};

// Create paddle props
const paddle = {
  x: canvas.width / 2 - 40, // premise : canvas.width =x(800) ,2-40 =y -> x: x/y conclusion x= x/y  -> 800/2-40  q: 축 or 연산자?  20?? -10?? 800/2(1-20) ||X축!! paddle.x는 고정되어 있지 않고 자유롭게 움직이는 좌표이니 변수로 설정했다.
  y: canvas.height - 20, //580 ->이게 고정값인가? 아님 유동적으로 변하는 값인가? 유동값이 좀 더 가능해보인다
  w: 80,
  h: 10,
  speed: 8,
  dx: 0,
  visible: true
};

// Create brick props (35~54)
const brickInfo = {//(아직 x,y좌표없음 45~54에서 x,y좌표 정의함.)
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 90,
  visible: true
};

// Create bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {//brickRowCount-수평(9)
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {//brcikColumnCount-수직(5)
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw ball on canvas
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = ball.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw paddle on canvas
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = paddle.visible ? '#0095dd' : 'transparent';
  ctx.fill();
  ctx.closePath();
}

// Draw score on canvas
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30); //크게 봐서 x.y 좌표 ??
}

// Draw bricks on canvas
function drawBricks() {
  bricks.forEach(column => {
    column.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
      ctx.fill();
      ctx.closePath();
    });
  });
}

// Move paddle on canvas
function movePaddle() {
  paddle.x += paddle.dx; //paddle.x = paddle.x + paddle.dx 

  // Wall detection(벽 탐지)
  if (paddle.x + paddle.w > canvas.width) { //패들의 너비와 x좌표가 canvas.width(800)보다 크면  paddle.x =canvas.width / 2 - 40  만약에 19이면 78>19 이면 성립된다
    paddle.x = canvas.width - paddle.w; //(800-80??)
  }

  if (paddle.x < 0) { //만약 패들이 x좌표에서 머무른다면 ->0이다
    paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
  ball.x += ball.dx; //ball.x = ball.x + ball.dx 
  ball.y += ball.dy;//ball.y = ball.y + ball.dy

  // Wall collision (right/left)// 여기서 canvas.width 는 무엇을 의미하는것인가-canvas.width는 직사각형 내부의 너비길이임. 300 +ball.size > 600 혹은 15>10 성립가능하다 기준치보다 떨어지면 성립하는것 같다.
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {// 이를 직역하면 ball.x + ball.size >canvas.width Or || ball.x - ball.size <0 으로 생각하자  |ball.x가 5를 가지려면 canvas.width가 10이되어야 한다.(하지만 충분히 가능하다-왼쪽 10이하가 왼쪽벽면에 닿을정도의 거리인가보다)
    ball.dx *= -1; // ball.dx = ball.dx * -1 |말그대로 x축만 생각하자(방향으로의 전환인것같다. 그러므로 collision은 감지기인것같다.) //ball.size =10으로 고정값을 취한다
  }

  // Wall collision (top/bottom)
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {//이를 직역하면 ball.y + ball.size>canvas.height Or ball.y-ball.size <0 이다. |ball.y는 canvas.height /2 로 고정되어 있다.
    ball.dy *= -1; //ball.dy = ball.dy * -1 |collision ->change direction (+-으로 생각하지말고 일차원적인 방향전환으로 생각하자)
  }

  // console.log(ball.x, ball.y);

  // Paddle collision 
  if (//1/10 2/100 3/500 (3번째로 가정) 
    ball.x - ball.size > paddle.x &&//canvas.width/2 -10 >paddle.x | canvas.width->1/10 2/100 3/500 |paddle.x= canvas.width / 2 - 40 2번째 연산을 돌려보면 240>250/2-40 가 되는데 ->240>125/1-20 -> +>-은 당연한 결과이기 때문에 성립한다
    ball.x + ball.size < paddle.x + paddle.w && //canvas.width/2 +10 < (paddle.x)= canvas.width / 2 - 40 + (paddle.w 80으로 고정되어 있다.)->260 < 500/ 2 - 40 +80 ->260<250/1-20 + 80  성립자체가 불가능하다.
    ball.y + ball.size > paddle.y//y좌표
  ) {
    ball.dy = -ball.speed; //ball.dy는 -4로 고정.(참고로 ball.dx는 4로 고정.) ball.speed는 10으로 고정->ball.speed의 음양이 바뀌었다.|ball.dy =ball.dy-ball.speed??  ->-14(원래 벽에 닿으면 속도가 일정속도 같은데 paddle을 맞닺게 되면 한번에 움직이는거리가 빨라지는것 같다)
  }

  // Brick collision  ,foreach: 순차적으로 함수를 실행한다(배열의 각 요소들에 대해서) //brcik collision -> break out
  bricks.forEach(column => {//column:수직
    column.forEach(brick => {
      if (brick.visible) {//만약 brick이 보인다고 가정하면 -> 다음 조건들을 실행한다
        if (//brick.w와 brick.h는 각각 70,20으로 고정되어 있다.
          ball.x - ball.size > brick.x && // left brick side check,  ball.x: canvas.width / 2 ,ball.size:10, brick.x: i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
          ball.x + ball.size < brick.x + brick.w && // right brick side check
          ball.y + ball.size > brick.y && // top brick side check ,  ball.y:canvas.height / 2
          ball.y - ball.size < brick.y + brick.h // bottom brick side check(맞았는지 첵킹)  ->left right top bottom 직사각형의 단면도 양옆 위아래 체크해서 3개다 옳으면 brick collison!!!
        ) {
          ball.dy *= -1;//ball.dy = ball.dy * -1 (튕겨나옴)  //결론을 보고 가정들을 추론해나가는것도 괜찮은 추론 방식이다.(거시적->미시적 추론)
          brick.visible = false; //충돌시켜서 ->brick break Out!!!

          increaseScore();// 함수 호출 
        }
      }
    });
  });

  // Hit bottom wall - Lose(공이 패들이 아닌 바닥에 닿을경우)
  if (ball.y + ball.size > canvas.height) { // 결론 canvas.height 는 고정값을 가지지 않는다 그러므로 변수처럼 상대값을 가진다 10이 될 수도 600이 될수 도 있는것이다 그런데 처음시작점은 600임에 자명하다.  ,ball.y: canvas.height(공의 높이) /2
    showAllBricks(); //당연히 게임이 끝났으니 showallbricks를 함으로써 게임 reset을 실행하는것이다
    score = 0;
  }
}

// Increase score
function increaseScore() {
  score++;//1씩 증감

  if (score % (brickRowCount * brickColumnCount) === 0) { // % 는 이항 연산자이다 두 피연산자를 나눈 후 나머지를 반환한다 ex: 12%5는 2를 반환한다
      ball.visible = false;
      paddle.visible = false;

      //After 0.5 sec restart the game
      setTimeout(function () {// seTimeout은 0.5초 기다리다가 실행하여 문장을 선행한다.
          showAllBricks();
          score = 0;
          paddle.x = canvas.width / 2 - 40;
          paddle.y = canvas.height - 20;
          ball.x = canvas.width / 2;
          ball.y = canvas.height / 2;
          ball.visible = true;
          paddle.visible = true;
      },delay)
  }
}

// Make all bricks appear 일반함수 let var = function(){console.log("var")} ->화삻표 함수 let var = ()-> console.log("var"), foreach 함수
function showAllBricks() {
  bricks.forEach(column => {
    column.forEach(brick => (brick.visible = true));
  });
}

// Draw everything
function draw() {
  // clear canvas 각 프레임 전에 캔버스를 지워야 한다 이전 원을 지우지 않고 모든 프레임에 새 원을 그리므로  공은 흔적을 남기고 있다
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
}

// Update canvas drawing and animation
function update() {
  movePaddle();
  moveBall();

  // Draw everything
  draw();

  requestAnimationFrame(update);
}

update();

// Keydown event 213~240까지 이해완료했음.
function keyDown(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    paddle.dx = paddle.speed;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    paddle.dx = -paddle.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (
    e.key === 'Right' ||
    e.key === 'ArrowRight' ||
    e.key === 'Left' ||
    e.key === 'ArrowLeft'
  ) {//4중 하나가 (실행중에)정지해버린다면 paddle.dx을 0으로 줘서 정지시킨다
    paddle.dx = 0;
  }
}

// Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Rules and close event handlers
rulesBtn.addEventListener('click', () => rules.classList.add('show'));
closeBtn.addEventListener('click', () => rules.classList.remove('show'));
