

class Orb {
  constructor({position}) {
    this.position = position
    this.radius = 20
    this.type = this.selectType()
    this.respawnCount = Math.floor(Math.random() * 150 + 75)
    this.spawned = false
  }

  draw() {
    if (this.type === 'speedBoost') {
      c.fillStyle = 'cornflowerblue'
    }
    else if (this.type === 'invincibility') {
      c.fillStyle  = 'indianred'
    }
    else if (this.type === 'powerJump') {
      c.fillStyle = 'greenyellow'
    }
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
    c.fill()
  }

  update() {
    if (this.spawned) {
      this.draw()
    }
    if (this.respawnCount === 0) {
      this.spawned = true
    }
    else {
      this.respawnCount--
    }
  }

  consume() {
    this.spawned = false
    this.respawnCount = Math.floor(Math.random() * 150 + 75)
    this.type = this.selectType()
  }

  selectType() {
    let typeSelector = Math.floor(Math.random() * 3)
    if (typeSelector === 0) {
      return 'speedBoost'
    }
    else if (typeSelector === 1) {
      return 'invincibility'
    }
    else if (typeSelector === 2) {
      return 'powerJump'
    }
  }
}