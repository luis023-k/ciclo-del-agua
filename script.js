<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  updateCloudX(); // recalcular cloudX al cambiar tamaño
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Sliders
const rainIntensitySlider = document.getElementById('rainIntensity');
const evaporationSlider = document.getElementById('evaporationSpeed');

// Nube
const cloud = document.getElementById('cloud');
let cloudX;
const cloudWidth = 200;

function updateCloudX() {
  cloudX = cloud.offsetLeft + cloud.offsetWidth / 2;
}
updateCloudX();

let drops = [];
let puddleHeight = 0;
let vaporParticles = [];

function createDrop() {
  return {
    x: cloudX - cloudWidth / 2 + Math.random() * cloudWidth,
    y: cloud.offsetTop + cloud.offsetHeight,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 4 + 4
  };
}

function updateDrops() {
  let maxDrops = parseInt(rainIntensitySlider.value);
  while (drops.length < maxDrops) {
    drops.push(createDrop());
  }

  drops = drops.filter(drop => drop.y < canvas.height);
  drops.forEach(drop => {
    drop.y += drop.speed;
    ctx.beginPath();
    ctx.strokeStyle = '#00aaff';
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();

    const puddleTop = canvas.height - canvas.height * 0.1 - puddleHeight;
    if (
      drop.y + drop.length > puddleTop &&
      drop.x > cloudX - cloudWidth / 2 &&
      drop.x < cloudX + cloudWidth / 2
    ) {
      puddleHeight = Math.min(puddleHeight + 0.05, canvas.height * 0.1);
    }
  });
}

function updateVapor() {
  let evaporationSpeed = parseFloat(evaporationSlider.value);
  if (evaporationSpeed > 0) {
    for (let i = 0; i < evaporationSpeed * 2; i++) {
      vaporParticles.push({
        x: cloudX - cloudWidth / 2 + Math.random() * cloudWidth,
        y: canvas.height - canvas.height * 0.1 - puddleHeight,
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
  ctx.fillStyle = '#0077aa';
  ctx.fillRect(
    cloudX - cloudWidth / 2,
    canvas.height - canvas.height * 0.1 - puddleHeight,
    cloudWidth,
    puddleHeight
  );
}

function drawVapor() {
  vaporParticles.forEach(p => {
    ctx.fillStyle = `rgba(200, 200, 200, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateDrops();
  updateVapor();
  drawPuddle();
  drawVapor();
  requestAnimationFrame(animate);
}

// --- Interacción nube: mouse + táctil ---
cloud.addEventListener('dragstart', e => {
  e.dataTransfer.setDragImage(new Image(), 0, 0);
});

document.addEventListener('dragover', e => {
  e.preventDefault();
  cloud.style.left = e.pageX - cloud.offsetWidth / 2 + 'px';
  updateCloudX();
});

// 👇 Soporte táctil
cloud.addEventListener('touchstart', e => e.preventDefault());
document.addEventListener('touchmove', e => {
  const touch = e.touches[0];
  cloud.style.left = touch.pageX - cloud.offsetWidth / 2 + 'px';
  updateCloudX();
});

animate();
</script>
