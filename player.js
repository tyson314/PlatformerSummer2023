const playerHeight = 110
const playerWidth = 50
const baseSpeed = 12
const jumpVelocity = -30

const hitboxHeight = 50
const hitboxWidth = 80
const hitboxOffsetX = 15
const hitboxOffsetY = 15

class Player {
  constructor({position, velocity, directionFacing, color}) {
    this.position = position
    this.velocity = velocity
    this.directionFacing = directionFacing
    this.color = color

    this.height = playerHeight
    this.width = playerWidth
    this.movementSpeed = baseSpeed

    this.lastKey = null
    this.onPlatform = false

    this.stunTimer = 0
    this.isStunned = false

    this.invulerabilityTimer = 0
    this.isInvulnerable = false
    
    this.attackTimer = 0
    this.canAttack

    this.powerUpTimer = 0
    this.currentPowerUp = null

    this.hasTrophy = false
    this.trophyTime = 0
    this.possessedTrophy = null
  }

  draw() {
    if (this.isStunned) {
      c.fillStyle = 'grey'
    }
    else {
      c.fillStyle = this.color
    }
    
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    
    if (this.hasTrophy) {
      c.fillStyle = 'gold'
    }
    else { 
      c.fillStyle = 'lightgrey'
    }

    let headOffsetX = 5
    let headoffsetY = 18
    let headSize = 30
    if (this.directionFacing === 'left') {
      c.fillRect(this.position.x + headOffsetX, this.position.y + headoffsetY, headSize, headSize)
    }
    if (this.directionFacing === 'right') {
      c.fillRect(this.position.x + this.width - headOffsetX - headSize, this.position.y + headoffsetY, headSize, headSize)
    }
  }

  update(platforms, orbs, trophy) {
    this.draw()
    
    this.detectPlatformCollisions(platforms)
    this.detectOrbCollisions(orbs)
    this.detectTrophyCollision(trophy)
    
    this.position.x += this.velocity.x
    if (this.onPlatform && this.isStunned) {
      this.stop()
    }
    if ((this.position.x + this.velocity.x + this.width > canvas.width)) {
      this.position.x = canvas.width - this.width
    }
    if ((this.position.x + this.velocity.x < 0)) {
      this.position.x = 0
    }
    this.position.y += this.velocity.y
    this.velocity.y += gravity

    if (this.hasTrophy) {
      this.trophyTime++
    }
    this.updateTimers()
    this.resolveConditions()
  }

  updateTimers() {
    this.stunTimer--
    this.powerUpTimer--
    this.attackTimer--
    this.invulerabilityTimer--
    
  }
  resolveConditions() {
    if (this.powerUpTimer < 0) {
      this.powerUpTimer = 0
      if (this.currentPowerUp === 'speedBoost') {
        this.movementSpeed = baseSpeed
      }
      this.currentPowerUp = null
    }
    if (this.stunTimer < 0) {
      this.stunTimer = 0
      this.isStunned = false
    }
    if (this.attackTimer < 0) {
      this.attackTimer = 0
      this.canAttack = true
    }
    if (this.invulerabilityTimer < 0) {
      this.invulerabilityTimer = 0
      this.isInvulnerable = false
    }
  }

  //Player Controls
  moveLeft() {
    if (!this.isStunned) {
      this.velocity.x = this.movementSpeed * -1
      this.directionFacing = 'left'
    }
  }
  moveRight() {
    if (!this.isStunned) {
      this.velocity.x = this.movementSpeed
      this.directionFacing = 'right'
    }
  }
  stop() {
    this.velocity.x = 0
  }
  jump() { 
    if (this.onPlatform && !this.isStunned) {
      this.velocity.y = jumpVelocity
      if (this.currentPowerUp === 'powerJump') {
        this.velocity.y = jumpVelocity * 1.5
      }
    }
  }
  crouch() {
    if (!this.isStunned) {
    this.height /= 2
    this.position.y += this.height
    }
  }
  uncrouch() {
    this.position.y -= this.height
    this.height *= 2
  }

  //Attacking
  attack(players) {
    if (!this.isStunned && this.canAttack) {
      for (const playerID in players) {
        const player = players[playerID]
        if (this !== player && this.detectAttackSuccess(player) && !player.isInvulnerable) {
          player.takeDamage(this.directionFacing)
        }
      }
      this.canAttack = false
      this.attackTimer = 15
    }
    
  }
  detectAttackSuccess(player) {
    return ( 
      this.detectAttackSuccessUpperBound(player)
      && this.detectAttackSuccessLowerBound(player)
      && this.detectAttackSuccessLeftBound(player)
      && this.detectAttackSuccessRightBound(player)
    )
  }
  detectAttackSuccessUpperBound(player) {
    return (this.position.y + hitboxOffsetY < player.position.y + player.height)
  }
  detectAttackSuccessLowerBound(player) {
    return (this.position.y + hitboxOffsetY + hitboxHeight > player.position.y)
  }
  detectAttackSuccessLeftBound(player) {
    if (this.directionFacing === 'right') {
      return (this.position.x + hitboxOffsetX < player.position.x + player.width)
    }
    else {
      return (this.position.x + this.width - hitboxOffsetX - hitboxWidth < player.position.x + player.width)
    }
  }
  detectAttackSuccessRightBound(player) {
    if (this.directionFacing === 'right') {
      return (this.position.x + hitboxOffsetX + hitboxWidth > player.position.x)
    }
    else {
      return (this.position.x + this.width - hitboxOffsetX > player.position.x)
    }
  }

  takeDamage(attackDirection) {
    this.stunTimer = 30
    this.isStunned = true
    if (attackDirection === 'left') {
      this.velocity.x = this.movementSpeed * -1
      this.velocity.y -= 20
    }
    else if (attackDirection === 'right') {
      this.velocity.x = this.movementSpeed
      this.velocity.y -= 20
    }
    this.hasTrophy = false
    this.possessedTrophy.drop({
      x: this.position.x + this.width / 2 - trophyDimensions / 2,
      y: this.position.y - this.height * 1.5
    })
    this.possessedTrophy = null
    this.hasTrophy = false
    this.invulerabilityTimer = 45
    this.isInvulnerable = true
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

  //PowerUp Collision Logic
  detectOrbCollisions(orbs) {
    for (const orb of orbs) {
      if (this.detectOrbCollision(orb)) {
        
        if (orb.type === 'speedBoost') {
          this.applySpeedBoost()
        }
        if (orb.type === 'invincibility') {
          this.applyInvincibility()
        }
        if (orb.type === 'powerJump') {
          this.applyPowerJump()
        }
      this.consumeOrb(orb)
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
  //PowerUp Effects
  applySpeedBoost() {
    this.currentPowerUp = 'speedBoost'
    this.movementSpeed *= 1.5
  }
  applyInvincibility() {
    this.currentPowerUp = 'invincibility'
    this.invulerabilityTimer = 75
    this.isInvulnerable = true
  }
  applyPowerJump() {
    this.currentPowerUp = 'powerJump'
  }

  //Trophy Collision Logic
  detectTrophyCollision(trophy) {
    //console.log('nigga')
    if (this.position.x < trophy.position.x + trophyDimensions
      && this.position.x + this.width > trophy.position.x
      && this.position.y < trophy.position.y + trophyDimensions
      && this.position.y + this.height > trophy.position.y
      && !trophy.pickedUp && trophy.isPickupable) {
        console.log(trophy)
        trophy.pickup()
        this.hasTrophy = true
        this.possessedTrophy = trophy
      }
  }
}