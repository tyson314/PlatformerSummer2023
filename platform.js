const platformHeight = 10

class Platform {
  constructor({position, width}) {
    this.position = position
    this.width = width
  }

  draw() {
    c.fillStyle = 'blueviolet'
    c.fillRect(this.position.x, this.position.y, this.width, platformHeight)
  }
  update() {
    this.draw()
  }
}