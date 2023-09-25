const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const gravity = 2.6

const smallPlatformWidth = 200
const largePlatformWidth = 500

const winningScore = 200

canvas.width = 1000
canvas.height = 750

c.fillRect(0, 0, canvas.width, canvas.height)

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

const players = {
playerOne: new Player({
  position: { x: 200,  y: 500 },
  velocity: { x: 0, y: 0 },
  directionFacing: 'right',
  color: 'red'
}), 
playerTwo: new Player({
  position: { x: 300, y: 300 },
  velocity: { x: 0, y: 0 },
  directionFacing: 'left',
  color: 'teal'
})}

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
    y: canvas.height - 160 - players.playerOne.height / 2 }
}), new Orb({
  position: {
    x: canvas.width - smallPlatformWidth / 2 - 130, 
    y: canvas.height - 160 - players.playerOne.height / 2 }
}), new Orb({
  position: {
    x: canvas.width / 2, 
    y: canvas.height - 310 - players.playerOne.height / 2 }
})]

const trophy = new Trophy({
    x: canvas.width / 2 - trophyDimensions / 2,
    y: 50
  })

function endGame(color) {
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.fillStyle = color
  
}
function animate() {
  if (players.playerOne.trophyTime > 200 || players.playerTwo.trophyTime > 200) {
    window.cancelAnimationFrame
    let color = null
    if (players.playerOne.trophyTime > 200) {
      color = 'red'
    }
    if (players.playerTwo.trophyTime > 200) {
      color = 'teal'
    }
    endGame(color)
    return
  }
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  for (const platform of platforms) {
    platform.update()
  }
  for (const orb of orbs) {
    orb.update()
  }
  trophy.update()
  players.playerOne.update(platforms, orbs, trophy)
  players.playerTwo.update(platforms, orbs, trophy)
  movePlayer()
  moveEnemy()
}

animate()
console.log('asl;djfasl;j')
c.fillStyle = 'black'
c.fillRect(0, 0, canvas.width, canvas.height)


window.addEventListener('keydown', (event) => {
  console.log(event.key)
  switch (event.key) {
    case 'a':
      keys.a.pressed = true
      players.playerOne.lastKey = 'a'
      break
    case 'd':
      keys.d.pressed = true
      players.playerOne.lastKey = 'd'
      break
    case 'w':
      if (!keys.w.pressed) { 
        players.playerOne.jump()
      }
      keys.w.pressed = true
      break
    case 's':
      if (!keys.s.pressed) {
        players.playerOne.crouch()
      }
      keys.s.pressed = true
      break
    case ' ':
      players.playerOne.attack(players)
      break

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      players.playerTwo.lastKey = 'ArrowLeft'
      break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      players.playerTwo.lastKey = 'ArrowRight'
      break
    case 'ArrowUp':
      if (!keys.ArrowUp.pressed) {
        players.playerTwo.jump()
      }
      keys.ArrowUp.pressed = true
      break
    case 'ArrowDown':
      if (!keys.ArrowDown.pressed) {
        players.playerTwo.crouch()
      }
      keys.ArrowDown.pressed = true
      break
    case '/':
      players.playerTwo.attack(players)
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      players.playerOne.uncrouch()
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
      players.playerTwo.uncrouch()
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
    if (players.playerOne.lastKey == 'a') {
      players.playerOne.moveLeft()
    }
    else if (players.playerOne.lastKey == 'd') {
      players.playerOne.moveRight()
    }
  }
  else if (keys.a.pressed) {
    players.playerOne.moveLeft()
  }
  else if (keys.d.pressed) {
    players.playerOne.moveRight()
  }
  else {
    players.playerOne.stop()
  }
}

function moveEnemy() {
  if (keys.ArrowLeft.pressed && keys.ArrowRight.pressed) {
    if (players.playerTwo.lastKey == 'ArrowLeft') {
      players.playerTwo.moveLeft()
    }
    else if (players.playerTwo.lastKey == 'ArrowRight') {
      players.playerTwo.moveRight()
    }
  }
  else if (keys.ArrowLeft.pressed) {
    players.playerTwo.moveLeft()
  }
  else if (keys.ArrowRight.pressed) {
    players.playerTwo.moveRight()
  }
  else {
    players.playerTwo.stop()
  }
}