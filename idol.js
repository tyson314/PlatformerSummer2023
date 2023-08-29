class Idol {
  constructor(position) {
    this.position = position

    this.image = new Image()
    this.image.src = './sprites/goldenTrophy.png'
  }

  draw() {
    console.log('put the idol')
    c.drawImage(this.image, this.position.x, this.position.y)
  }
  update() {
    this.draw()
  }
}