const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const rainIntensitySlider = document.getElementById('rainIntensity');
const evaporationSlider = document.getElementById('evaporationSpeed');

const clouds = [
  document.getElementById('cloud1'),
  document.getElementById('cloud2'),
  document.getElementById('cloud3'),
  document.getElementById('cloud4'),
  document.getElementById('cloud5'),
];

let cloudX = width / 2;
const cloudWidth = 2000;

let drops = [];
let puddleHeight = 0;
let vaporParticles = [];

function createDrop() {
  return {
    x: cloudX - cloudWidth / 2 + Math.random() * cloudWidth,
    y: 160,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 4 + 4
  };
}

function updateDrops() {
  let maxDrops = parseInt(rainIntensitySlider.value);
  while (drops.length < maxDrops) {
    drops.push(createDrop());
  }

  drops = drops.filter(drop => drop.y < height);
  drops.forEach(drop => {
    drop.y += drop.speed;
    ctx.beginPath();
    ctx.strokeStyle = '#00aaff';
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();
    if (drop.y + drop.length > height - 100 - puddleHeight &&
        drop.x > cloudX - cloudWidth / 2 && drop.x < cloudX + cloudWidth / 2) {
      puddleHeight = Math.min(puddleHeight + 0.05, 100);
    }
  });
}

function updateVapor() {
  let evaporationSpeed = parseFloat(evaporationSlider.value);
  if (evaporationSpeed > 0) {
    for (let i = 0; i < evaporationSpeed * 2; i++) {
      vaporParticles.push({
        x: cloudX - cloudWidth / 2 + Math.random() * cloudWidth,
        y: height - puddleHeight - 50,
        alpha: 1,
        rise: Math.random() * 1 + 0.5
      });
    }
  }

  puddleHeight = Math.max(0, puddleHeight - evaporationSpeed * 0.1);

  vaporParticles.forEach(p => {
    p.y -= p.rise;
    p.alpha -= 0.01;
  });

  vaporParticles = vaporParticles.filter(p => p.alpha > 0);
}

function drawPuddle() {
  ctx.fillStyle = '#57e6f0ea';
  ctx.fillRect(cloudX - cloudWidth / 2, height - 50 - puddleHeight, cloudWidth, puddleHeight);
}

function drawVapor() {
  vaporParticles.forEach(p => {
    ctx.fillStyle = `rgba(200, 200, 200, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateClouds() {
  const intensity = parseInt(rainIntensitySlider.value);
  const numVisible = Math.floor(intensity / 20);
  clouds.forEach((cloud, index) => {
    if (index < numVisible) {
      cloud.style.display = 'block';
      cloud.classList.toggle('storm', intensity >= 80);
    } else {
      cloud.style.display = 'none';
    }
  });
}

rainIntensitySlider.addEventListener('input', updateClouds);
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

updateClouds();

function animate() {
  ctx.clearRect(0, 0, width, height);
  updateDrops();
  updateVapor();
  drawPuddle();
  drawVapor();
  requestAnimationFrame(animate);
}

animate();