let audioContext;
let device;
let canvas;
let isClicked = false; // Переменная для отслеживания состояния клика

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);

    colorMode(RGB);
    rectMode(CENTER);
    noStroke();

    let AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (AudioContextConstructor) {
        audioContext = new AudioContextConstructor();
    } else {
        console.error("Web Audio API не поддерживается в этом браузере");
    }

    loadRNBO();

    canvas.mouseClicked(() => {
        startAudioContext();
        isClicked = true; // После клика изменяем состояние на true
    });
}

async function loadRNBO() {
    // Убедитесь, что объект RNBO доступен
    const { createDevice } = RNBO;

    // Здесь предполагается, что resume будет вызван позже в startAudioContext
    // await audioContext.resume(); 

    const rawPatcher = await fetch('patch.export.json');
    const patcher = await rawPatcher.json();

    device = await createDevice({ context: audioContext, patcher });
    device.node.connect(audioContext.destination);
}

function startAudioContext() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

let zOffset = 0;

function draw() {
    if (!isClicked) {
        background(255, 255, 255);
        fill(0, 0, 255); // Синий цвет для текста
        textSize(32);
        textAlign(LEFT, CENTER);
        text('plz click me', 20, height / 2);
    } else {
        background(255, 255, 255);
        let tileSize = 100;
        for (let x = 0; x < width; x += tileSize) {
            for (let y = 0; y < height; y += tileSize) {
                let noiseValue = noise(x * 0.5, y * 0.5, zOffset);
                
                if (noiseValue > 0.4) {
                    fill(255, 255, 255); // Белый цвет
                } else {
                    fill(0, 0, 255); // Синий цвет
                }
                
                noStroke();
                rect(x, y, tileSize, tileSize);
            }
        }
        zOffset += 0.03;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Пересоздаем холст с новыми размерами окна
    // Здесь может потребоваться дополнительная логика для адаптации ваших графических элементов под новый размер холста
}

