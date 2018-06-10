function animateYoutubeLoadingCanvas() {
  let cObj = getContext('.container .intro .video canvas')
  let c = cObj.context
  let canvas = cObj.canvas

  function Particle(x, y, velocity) {
    this.velocity = velocity
    this.radians = Math.random() * Math.PI * 2
    this.x = this.x_ori = x
    this.y = this.y_ori = y
    this.distance = (Math.random() + 1) * 10
  }

  Particle.prototype.update = function () {
    this.radians += this.velocity
    this.x = this.x_ori + Math.cos(this.radians) * this.distance
    this.y = this.y_ori + Math.sin(this.radians) * this.distance

    c.beginPath()
    c.fillStyle = 'white'
    c.fillRect(this.x, this.y, 2, 2)
    c.closePath()
  }

  let particles = []
  for (let i = 0; i < 10; i++) {
    particles.push(new Particle(canvas.width / 2, canvas.height / 2, Math.random() * (.1 - .05) + .05))
  }

  function draw() {
    requestAnimationFrame(draw)

    c.fillStyle = 'rgba(0,0,0,.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    particles.forEach(function (particle) {
      particle.update()
    })
  }

  draw()
}