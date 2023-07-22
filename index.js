const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const gravity = 4.5

const smallPlatformWidth = 200
const largePlatformWidth = 500

canvas.width = 1000
canvas.height = 750

c.fillRect(0, 0, canvas.width, canvas.height)

const playerOne = new Player({
  position: { x: 200,  y: 500 },
  velocity: { x: 0, y: 0 }
})

const playerTwo = new Player({
  position: { x: 300, y: 300 },
  velocity: { x: 0, y: 0 }
})

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

const platforms = 
[ new Platform({ 
  position: {x: 0, y: canvas.height - platformHeight},
  width: canvas.width
}), new Platform({
  position: {x: 130, y: canvas.height - 150 - platformHeight},
  width: smallPlatformWidth
}), new Platform({ 
  position: {x: canvas.width - smallPlatformWidth - 130, y: canvas.height - 150 - platformHeight},
  width: smallPlatformWidth
}), new Platform({ 
  position: {x: canvas.width / 2 - 250, y: canvas.height - platformHeight - 300},
  width: largePlatformWidth
}), new Platform({ 
  position: {x: 0, y: canvas.height - platformHeight - 420},
  width: smallPlatformWidth
}),
new Platform({ 
  position: {x: canvas.width - smallPlatformWidth, y: canvas.height - platformHeight - 420},
  width: smallPlatformWidth
})]

const orbs = [ new Orb({
  position: {
    x: smallPlatformWidth / 2 + 130, 
    y: canvas.height - 160 - playerOne.height / 2 }
}), new Orb({
  position: {
    x: canvas.width - smallPlatformWidth / 2 - 130, 
    y: canvas.height - 160 - playerOne.height / 2 }
}), new Orb({
  position: {
    x: canvas.width / 2, 
    y: canvas.height - 310 - playerOne.height / 2 }
})]

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  for (const platform of platforms) {
    platform.update()
  }
  for (const orb of orbs) {
    orb.update()
  }
  playerOne.update(platforms, orbs)
  playerTwo.update(platforms, orbs)
  movePlayer()
  moveEnemy()
}

animate()



window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = true
      playerOne.lastKey = 'a'
      break
    case 'd':
      keys.d.pressed = true
      playerOne.lastKey = 'd'
      break
    case 'w':
      if (!keys.w.pressed) { 
        playerOne.jump()
      }
      keys.w.pressed = true
      break
    case 's':
      if (!keys.s.pressed) {
        playerOne.crouch()
      }
      keys.s.pressed = true
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      playerTwo.lastKey = 'ArrowLeft'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      playerTwo.lastKey = 'ArrowRight'
      break
    case 'ArrowUp':
      if (!keys.ArrowUp.pressed) {
        playerTwo.jump()
      }
      keys.ArrowUp.pressed = true
      break
    case 'ArrowDown':
      if (!keys.ArrowDown.pressed) {
        playerTwo.crouch()
      }
      keys.ArrowDown.pressed = true
      break
    case 'y':
      console.log(playerOne)
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      playerOne.uncrouch()
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
      playerTwo.uncrouch()
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
    if (playerOne.lastKey == 'a') {
      playerOne.velocity.x = playerOne.movementSpeed * -1
    }
    else if (playerOne.lastKey == 'd') {
      playerOne.velocity.x = playerOne.movementSpeed
    }
  }
  else if (keys.a.pressed) {
    playerOne.velocity.x = playerOne.movementSpeed * -1
  }
  else if (keys.d.pressed) {
    playerOne.velocity.x = playerOne.movementSpeed
  }
  else {
    playerOne.velocity.x = 0
  }
}

function moveEnemy() {
  if (keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
    if (playerTwo.lastKey == 'ArrowLeft') {
      playerTwo.velocity.x = playerTwo.movementSpeed * -1
    }
    else if (playerTwo.lastKey == 'ArrowRight') {
      playerTwo.velocity.x = playerTwo.movementSpeed
    }
  }
  else if (keys.ArrowLeft.pressed) {
    playerTwo.velocity.x = playerTwo.movementSpeed * -1
  }
  else if (keys.ArrowRight.pressed) {
    playerTwo.velocity.x = playerTwo.movementSpeed
  }
  else {
    playerTwo.velocity.x = 0
  }
}