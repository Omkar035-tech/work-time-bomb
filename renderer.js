// Your existing timer functionality
const beep_sound = new Audio('https://merchedev.github.io/codepen-assets/assets/sound/bomb-beep.mp3');
const button_sound = new Audio('https://merchedev.github.io/codepen-assets/assets/sound/button-beep.mp3');
const explosion_sound = new Audio('https://merchedev.github.io/codepen-assets/assets/sound/cannon.mp3');
const log = require('electron-log');
let digits = {
    1: 0,
    2: 0,
    3: 0,
    4: 0
};
let count_int;
const lcd = document.querySelector('.lcd__time');
const set_button = document.querySelector('.circuit__red-button');
let timer_set = false;

// Make window draggable
const dragHandle = document.querySelector('.drag-handle');
let isDragging = false;

dragHandle.addEventListener('mousedown', (e) => {
    isDragging = true;
    window.electronAPI.startDrag({ x: e.clientX, y: e.clientY });
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        window.electronAPI.dragging({ x: e.clientX, y: e.clientY });
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    window.electronAPI.endDrag();
});

// Make window resizable
let startX, startY, startWidth, startHeight;

document.addEventListener('mousedown', function (e) {
    if (e.target.classList.contains('resize-handle')) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(document.body).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(document.body).height, 10);
        e.preventDefault();
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }
});

function resize(e) {
    const width = startWidth + e.clientX - startX;
    const height = startHeight + e.clientY - startY;

    // Calculate scale factor
    const scaleX = width / 600; // Original width is 600
    const scaleY = height / 400; // Original height is 400
    const scale = Math.min(scaleX, scaleY);

    document.body.style.transform = `scale(${scale})`;
    document.body.style.transformOrigin = 'top left';
}

function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

// Add resize handle to HTML
const resizeHandle = document.createElement('div');
resizeHandle.className = 'resize-handle';
resizeHandle.style.position = 'absolute';
resizeHandle.style.bottom = '0';
resizeHandle.style.right = '0';
resizeHandle.style.width = '10px';
resizeHandle.style.height = '10px';
resizeHandle.style.backgroundColor = 'rgba(0,0,0,0.2)';
resizeHandle.style.cursor = 'nwse-resize';
document.body.appendChild(resizeHandle);

// Your existing timer functions
set_button.addEventListener('click', setTimer);
lcd.innerText = `${digits[1]}${digits[2]}:${digits[3]}${digits[3]}`;

let sumNum = (e) => {
    log.info('Hello from renderer!', e);
    const digit = e.id.split('d')[1];
    button_sound.play();
    if (timer_set == false) {
        if ((digit == 1) && digits[digit] == 5 || (digit == 3) && digits[digit] == 5 || (digit == 2) && digits[digit] == 9 || (digit == 4) && digits[digit] == 9) {
            digits[digit] = 0;
        }
        else {
            digits[digit]++
        }
        updateTimer();
    }
}

function setTimer() {
    button_sound.play();

    let mins = String(digits[1]) + String(digits[2]);
    let secs = String(digits[3]) + String(digits[4]);
    if (!timer_set && (mins > 0 || secs > 0)) {
        timer_set = true;

        count_int = setInterval(() => {
            if (secs == 0) {
                if (mins == 0) {
                    explosion();
                } else {
                    mins--;
                    secs = 59;
                    turnOnLed();
                }

            } else {
                secs--;
                turnOnLed();
            }
            if (String(secs).length > 1) {
                digits[3] = String(secs)[0];
                digits[4] = String(secs)[1];
            } else {
                digits[3] = 0;
                digits[4] = String(secs)[0];
            }
            if (String(mins).length > 1) {
                digits[1] = String(mins)[0];
                digits[2] = String(mins)[1];
            } else {
                digits[1] = 0;
                digits[2] = String(mins)[0];
            }

            updateTimer();

        }, 1000);
    }
}

function turnOnLed() {
    const led = document.querySelector('.circuit__led');
    beep_sound.play();
    led.classList.add('circuit__led--on');
    setTimeout(function () {
        led.classList.remove('circuit__led--on');
    }, 850)
}

function updateTimer() {
    lcd.innerText = `${digits[1]}${digits[2]}:${digits[3]}${digits[4]}`;
}

function explosion() {
    clearInterval(count_int);
    timer_set = false;
    explosion_sound.play();
    confettiExplosion();
}

function confettiExplosion() {
    const bomb = document.querySelector('.bomb');
    const num = 500;
    const colors = ['#9B1818', '#B5BC2B', '#1C9949', '#1D8899', '#BC3B91'];
    const signs = ['-', '+'];
    for (let i = 0; i < num; i++) {
        const random_color = colors[Math.floor(Math.random() * colors.length)];
        const random_x = randomFloat(-10, 110);
        const random_y = randomFloat(-20, 50);
        const random_degree = Math.floor(Math.random() * 360);
        const random_scale = randomFloat(0.2, 3.5)
        const random_sign = signs[Math.floor(Math.random() * signs.length)];
        const random_time = randomFloat(0.2, 0.7)
        const random_time_2 = randomFloat(0.2, 1.5)
        const random_time_3 = randomFloat(0.5, 2)
        bomb.classList.add('bomb--explosion')

        const new_confetti = document.createElement('div');
        new_confetti.setAttribute('class', 'confetti');
        new_confetti.style.transition = `top ${random_time}s ease-out, background ${random_time}s ease-out`;

        new_confetti.style.top = `calc(50vh ${random_sign} ${randomFloat(0, 10)}em)`;
        new_confetti.style.backgroundColor = random_color;

        setTimeout(() => {
            new_confetti.style.opacity = '1';
            new_confetti.style.transition = `all ${random_time_2}s ease-out`;
            new_confetti.style.left = random_x + 'vw';
            new_confetti.style.top = random_y + 'vh';
            new_confetti.style.transform = `rotateZ(${random_degree}deg) scale(${random_scale})`;
            setTimeout(() => {
                new_confetti.style.transition = `all ${random_time_3}s ease-out`;
                new_confetti.style.top = '125vh';

                setTimeout(() => {
                    new_confetti.remove();
                    bomb.classList.remove('bomb--explosion')
                }, 2000);
            }, (random_time_3 * 100));
        }, (random_time_2 * 100));

        document.body.appendChild(new_confetti);
    }
}

function randomFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}