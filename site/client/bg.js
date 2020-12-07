const bg = document.getElementById('bg')
const ww = window.innerWidth
const sh = document.documentElement.scrollHeight
const area = ww * sh
const density = Math.round((area / (200 * 200)) * 5) // 5 dots per 200x200px space

function random (low, high) {
  const range = high - low
  return (Math.random() * range + low).toFixed(2)
}

function createDot () {
  const dot = document.createElement('div')
  const size = random(0.5, 2)
  const z = size / 4

  dot.style.cssText = `
    position: absolute;
    background: currentColor;
    border-radius: 10px;
    top: ${random(0, sh)}px; left: ${random(0, ww)}px;
    padding: ${size}px;
    opacity: ${z};
  `

  bg.appendChild(dot)
}

export function relayout () {
  bg.innerHTML = ''
  Array(density)
    .fill(0)
    .forEach(createDot)
}

relayout()
