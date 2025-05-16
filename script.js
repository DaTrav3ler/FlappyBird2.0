let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds_effect/point.mp3');
let sound_die = new Audio('sounds_effect/die.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

// Control bird movement
let bird_dy = 0;
document.addEventListener('keydown', (e) => {
  if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
    img.src = 'images/Bird-2.png';
    bird_dy = -7.6;
  }
});

document.addEventListener('keyup', (e) => {
  if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
    img.src = 'images/Bird.png';
  }
});

// Start game
document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' && game_state != 'Play') {
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.remove());
    img.style.display = 'block';
    bird.style.top = '40vh';
    score_val.innerHTML = '0';
    message.innerHTML = '';
    message.classList.remove('messageStyle');
    score_title.innerHTML = 'Score:';
    game_state = 'Play';
    play();
  }
});

function play() {
  function move() {
    if (game_state !== 'Play') return;

    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach((element) => {
      let pipe_rect = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_rect.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_rect.left + pipe_rect.width &&
          bird_props.left + bird_props.width > pipe_rect.left &&
          bird_props.top < pipe_rect.top + pipe_rect.height &&
          bird_props.top + bird_props.height > pipe_rect.top
        ) {
          gameOver();
          return;
        } else {
          if (
            pipe_rect.right < bird_props.left &&
            pipe_rect.right + move_speed >= bird_props.left &&
            element.increase_score === '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_rect.left - move_speed + 'px';
        }
      }
    });

    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);

  function apply_gravity() {
    if (game_state !== 'Play') return;

    bird_dy += gravity;
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      gameOver();
      return;
    }

    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_separation = 0;
  let pipe_gap = 35;

  function create_pipe() {
    if (game_state !== 'Play') return;

    if (pipe_separation > 115) {
      pipe_separation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;

      let pipe_top = document.createElement('div');
      pipe_top.className = 'pipe_sprite';
      pipe_top.style.top = pipe_posi - 70 + 'vh';
      pipe_top.style.left = '100vw';
      document.body.appendChild(pipe_top);

      let pipe_bottom = document.createElement('div');
      pipe_bottom.className = 'pipe_sprite sprite';
      pipe_bottom.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_bottom.style.left = '100vw';
      pipe_bottom.increase_score = '1';
      document.body.appendChild(pipe_bottom);
    }
    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

function gameOver() {
  game_state = 'End';
  message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter to Restart';
  message.classList.add('messageStyle');
  img.style.display = 'none';
  sound_die.play();
}




