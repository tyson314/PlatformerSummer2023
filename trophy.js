const trophyDimensions = 100
const trophyDisabledTime = 45

class Trophy {
  constructor(position) {
    this.position = position

    this.pickedUp = false
    this.isPickupable = true
    this.pickupableTimer = 0
    
    this.image = new Image()
    this.image.src = 'sprites/trophyCut.png'
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, trophyDimensions, trophyDimensions)
  }

  update() {
    if (!this.pickedUp) {
      this.draw()
    }

    this.pickupableTimer--
    if (this.pickupableTimer < 0) {
      this.isPickupable = true
      this.pickupableTimer = 0
    }

    if (!this.isPickupable) {
      this.image.src = 'sprites/greyedOutTrophy.png'
    }
    else {
      this.image.src = 'sprites/trophyCut.png'
    }
  }

  drop(position) {
    this.pickupableTimer = trophyDisabledTime
    this.isPickupable = false
    this.pickedUp = false
    this.position.x = position.x
    this.position.y = position.y
  }

  pickup() {
    this.pickedUp = true
  }
}