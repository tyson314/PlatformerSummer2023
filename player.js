class Player {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.height = 110
    this.width = 50
    this.movementSpeed = 10
    this.lastKey = null
    this.onPlatform = false
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update(platforms) {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if ((this.position.x + this.velocity.x + this.width > canvas.width)) {
      this.position.x = canvas.width - this.width
    }
    if ((this.position.x + this.velocity.x < 0)) {
      this.position.x = 0
    }
    this.detectPlatformCollisions(platforms)
    this.position.y += this.velocity.y
    this.velocity.y += gravity
  }

  jump() { 
    if (this.onPlatform) {
      this.velocity.y = -28
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
      && this.position.y + this.height - 10 < platform.position.y)
  }

  wouldPassThroughPlatform(platform) {
    return (this.position.y + this.height + this.velocity.y >= platform.position.y)
  }

  platformCollision(platform) {
    this.velocity.y = 0
    this.position.y = platform.position.y - this.height
    this.onPlatform = true
  }
}