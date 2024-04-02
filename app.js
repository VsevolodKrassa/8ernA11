let audioContext;
let device;
let canvas;

async function setup() {
    canvas = createCanvas(720, 720);
    noCursor();

    colorMode(RGB);
    rectMode(CENTER);
    noStroke();

    let AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (AudioContextConstructor) {
        audioContext = new AudioContextConstructor();
        try {
            await audioContext.resume();
            await loadRNBO(); // Инициализация и загрузка звука сразу после создания контекста
            console.log("Аудио загружено и воспроизведение началось.");
        } catch (error) {
            console.error("Ошибка при воспроизведении аудио:", error);
        }
    } else {
        console.error("Web Audio API не поддерживается в этом браузере");
    }
}

async function loadRNBO() {
    const { createDevice } = RNBO; // Убедитесь, что объект RNBO доступен

    await audioContext.resume();

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

let zOffset = 0; // Начальное значение для "глубины" шума Перлина

function draw() {
  background(0);

  let tileSize = 100;
  for (let x = 0; x < width; x += tileSize) {
    for (let y = 0; y < height; y += tileSize) {
      let noiseValue = noise(x * 0.5, y * 0.5, zOffset);
      
      // Использование порога для определения заполненности квадрата
      if (noiseValue > 0.4) {
        fill(255, 255, 255); // Если значение шума выше порога, используем белый цвет
      } else {
        fill(0, 0, 255); // Если значение шума ниже порога, используем черный цвет
      }
      
      noStroke();
      rect(x, y, tileSize, tileSize);
    }
  }

  zOffset += 0.03; // Меняем zOffset для динамичности паттерна
}

