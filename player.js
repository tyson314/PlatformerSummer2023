const playerHeight = 110
const playerWidth = 50
const baseSpeed = 18

class Player {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity

    this.height = playerHeight
    this.width = playerWidth
    this.movementSpeed = baseSpeed

    this.lastKey = null
    this.onPlatform = false

    this.powerUpTimer = 0
    this.currentPowerUp = null
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update(platforms, orbs) {
    this.draw()
    this.detectPlatformCollisions(platforms)
    this.detectOrbCollisions(orbs)
    this.position.x += this.velocity.x
    if ((this.position.x + this.velocity.x + this.width > canvas.width)) {
      this.position.x = canvas.width - this.width
    }
    if ((this.position.x + this.velocity.x < 0)) {
      this.position.x = 0
    }
    this.position.y += this.velocity.y
    this.velocity.y += gravity

    if (this.powerUpTimer > 0) {
      this.powerUpTimer--
    }
    if (this.powerUpTimer === 0) {
      if (this.currentPowerUp === 'speedBoost') {
        this.movementSpeed = baseSpeed
      }
      this.currentPowerUp = null
    }
  }

  //Player Controls
  jump() { 
    if (this.onPlatform) {
      this.velocity.y = -40
      if (this.currentPowerUp === 'powerJump') {
        this.velocity.y = -60
      }
    }
  }
  crouch() {
    this.height /= 2
    this.position.y += this.height
  }
  uncrouch() {
    this.position.y -= this.height
    this.height *= 2
  }

  //Platform Collision Logic
  detectPlatformCollisions(platforms) {
    
    for (const platform of platforms) {
      if (this.isAbovePlatform(platform) && this.wouldPassThroughPlatform(platform)) {
        this.platformCollision(platform)
        return
      }
    }
    this.onPlatform = false
  }
  isAbovePlatform(platform) {
    return (platform.position.x <= this.position.x + this.width + this.velocity.x 
      && platform.position.x + platform.width >= this.position.x + this.velocity.x
      && this.position.y + this.height <= platform.position.y)
  }
  wouldPassThroughPlatform(platform) {
    return (this.position.y + this.height + this.velocity.y >= platform.position.y)
  }
  platformCollision(platform) {
    this.velocity.y = 0
    this.position.y = platform.position.y - this.height
    this.onPlatform = true
  }

  detectOrbCollisions(orbs) {
    for (const orb of orbs) {
      console.log(orb)
      if (this.detectOrbCollision(orb)) {
        console.log(this)
        this.consumeOrb(orb)
        if (orb.type === 'speedBoost') {
          this.applySpeedBoost()
        }
        if (orb.type === 'invincibility') {
          this.applyInvincibility()
        }
        if (orb.type === 'powerJump') {
          this.applyPowerJump()
        }
      }
    }
  }
  detectOrbCollision(orb) {
    return (this.position.x < orb.position.x + orb.radius
      && this.position.x + this.width > orb.position.x - orb.radius
      && this.position.y < orb.position.y + orb.radius
      && this.position.y + this.height > orb.position.y - orb.radius
      && orb.spawned
      && this.currentPowerUp === null)
  }
  consumeOrb(orb) {
    orb.consume()
    this.powerUpTimer = 75
  }
  applySpeedBoost() {
    this.currentPowerUp = 'speedBoost'
    this.movementSpeed *= 1.5
  }
  applyInvincibility() {
    this.currentPowerUp = 'invincibility'
  }
  applyPowerJump() {
    this.currentPowerUp = 'powerJump'
  }
}