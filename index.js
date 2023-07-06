const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const gravity = 3

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.width = 50
    this.movementSpeed = 10
    this.lastKey = null
    this.jumpReady = true
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if ((this.position.x + this.velocity.x + this.width > canvas.width)) {
      this.position.x = canvas.width - this.width
    }
    if ((this.position.x + this.velocity.x < 0)) {
      this.position.x = 0
    }
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.position.y = canvas.height - this.height
      this.velocity.y = 0
      this.jumpReady = true
    }
    else {
      this.velocity.y += gravity
      this.jumpReady = false
    }
  }

  jump() { 
    this.velocity.y = -28
    this.jumpReady = false
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
    },
    velocity: {
      x: 0,
      y: 0
    }
})

const enemy = new Sprite({
  position: {
  x: 300,
  y: 300
  },
  velocity: {
    x: 0,
    y: 0
  }
})

player.draw()
enemy.draw()

const keys = {
  a: { pressed: false },
  w: { pressed: false },
  s: { pressed: false },
  d: { pressed: false },
  space: { pressed: false },

  ArrowLeft: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowDown: { pressed: false },
  ArrowUp: { pressed: false }
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()
  movePlayer()
  moveEnemy()
}

animate()



window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'w':
      if (!keys.w.pressed && player.jumpReady) { 
        player.jump()
      }
      keys.w.pressed = true
      break
    case 's':
      if (!keys.s.pressed) {
        player.height /= 2
        player.position.y += player.height
      }
      keys.s.pressed = true
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowUp':
      if (!keys.ArrowUp.pressed && enemy.jumpReady) {
        enemy.velocity.y = -28
      }
      keys.ArrowUp.pressed = true
      break
    case 'ArrowDown':
      if (!keys.ArrowDown.pressed) {
        enemy.height /= 2
        enemy.position.y += enemy.height
      }
      keys.ArrowDown.pressed = true
      break
  }
})

window.addEventListener('keyup', (event) => {
  console.log(event.key)
  switch (event.key) {
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      player.position.y -= player.height
      player.height *= 2
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
    case 'ArrowDown':
      enemy.position.y -= enemy.height
      enemy.height *= 2
      keys.ArrowDown.pressed = false
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break
  }
}) 

function movePlayer() {
  if (keys.a.pressed && keys.d.pressed) {
    if (player.lastKey == 'a') {
      player.velocity.x = player.movementSpeed * -1
    }
    else if (player.lastKey == 'd') {
      player.velocity.x = player.movementSpeed
    }
  }
  else if (keys.a.pressed) {
    player.velocity.x = player.movementSpeed * -1
  }
  else if (keys.d.pressed) {
    player.velocity.x = player.movementSpeed
  }
  else {
    player.velocity.x = 0
  }
}

function moveEnemy() {
  if (keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
    if (enemy.lastKey == 'ArrowLeft') {
      enemy.velocity.x = enemy.movementSpeed * -1
    }
    else if (enemy.lastKey == 'ArrowRight') {
      enemy.velocity.x = enemy.movementSpeed
    }
  }
  else if (keys.ArrowLeft.pressed) {
    enemy.velocity.x = enemy.movementSpeed * -1
  }
  else if (keys.ArrowRight.pressed) {
    enemy.velocity.x = enemy.movementSpeed
  }
  else {
    enemy.velocity.x = 0
  }
}