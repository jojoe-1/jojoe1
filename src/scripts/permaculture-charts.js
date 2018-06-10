function sketch(p) {

  p.setup = function () {
    let canvas = p.createCanvas(560, 315)
    canvas.parent($('.container .planting .planting-canvas')[0])

    p.CHART_HEIGHT_PADDING = .10
    p.CHART_WIDTH_PADDING = .05
    p.CHART_WIDTH = p.width - 2 * p.CHART_WIDTH_PADDING * p.width
    p.CHART_HEIGHT = p.height - 2 * p.CHART_HEIGHT_PADDING * p.height
    p.CHART_ORIGIN = {
      x: p.width * p.CHART_WIDTH_PADDING,
      y: p.height - p.height * p.CHART_HEIGHT_PADDING
    }
    p.CHART_X_AXIS = {
      x: p.width - p.width * p.CHART_WIDTH_PADDING,
      y: p.height - p.height * p.CHART_HEIGHT_PADDING
    }
    p.CHART_Y_AXIS = {
      x: p.width * p.CHART_WIDTH_PADDING,
      y: p.height * p.CHART_HEIGHT_PADDING
    }

    p.Rect = function (x, y, w, h) {
      this.x = x
      this.y = y
      this.w = w
      this.h = h
    }

    function Chart(data) {
      this.data = data
      this.dataRects = []
    }

    Chart.prototype.update = function () {
      this.drawMonths()
      this.drawData()
      this.drawXAxis()
      this.drawYAxis()
    }

    Chart.prototype.drawXAxis = function () {
      p.stroke('#222')
      p.line(p.CHART_ORIGIN.x, p.CHART_ORIGIN.y, p.CHART_X_AXIS.x, p.CHART_X_AXIS.y)
    }

    Chart.prototype.drawYAxis = function () {
      p.stroke('#222')
      p.line(p.CHART_ORIGIN.x, p.CHART_ORIGIN.y, p.CHART_Y_AXIS.x, p.CHART_Y_AXIS.y)
    }

    Chart.prototype.drawMonths = function () {
      let evenMonth = true, N = 12
      for (let i = 0; i < N; i++, evenMonth = !evenMonth) {
        p.noStroke()
        p.fill(evenMonth ? '#f1ead7' : '#fff8e1')
        p.rect(
          p.width * p.CHART_WIDTH_PADDING + p.CHART_WIDTH * i / N,
          p.height * p.CHART_HEIGHT_PADDING,
          p.CHART_WIDTH / N,
          p.CHART_HEIGHT)
      }
    }

    Chart.prototype.drawData = function () {
      let dataLength = this.data.length
      for (let i = 0; i < dataLength; i++) {
        let plantData = this.data[i]

        const YEAR_PERIOD = 365 * 24 * 3600 * 1000
        let cropPeriod = plantData.end.getTime() - plantData.start.getTime()
        let cropFromYearStartPeriod = plantData.start.getTime() - new Date(plantData.start.getFullYear(), 1).getTime()

        let rect = new p.Rect(
          p.width * p.CHART_WIDTH_PADDING + cropFromYearStartPeriod * p.CHART_WIDTH / YEAR_PERIOD, // start planting
          p.height * p.CHART_HEIGHT_PADDING + p.CHART_HEIGHT * i / dataLength,
          cropPeriod * p.CHART_WIDTH / YEAR_PERIOD, // end harvesting
          p.CHART_HEIGHT / dataLength)
        if (this.dataRects.find(function (r) {return r.id === i}) === undefined) {
          this.dataRects.push({
            id: i,
            rect: rect
          })
        }

        p.fill('#79f193')
        p.rect(rect.x, rect.y, rect.w, rect.h)
      }
    }

    p.chart = new Chart([
      {name: 'Winter', start: new Date(2018, 1), end: new Date(2018, 3, 15)},
      {name: 'Summer', start: new Date(2018, 4), end: new Date(2018, 8)},
      {name: 'Corn', start: new Date(2018, 4), end: new Date(2018, 6, 14)},
      {name: 'Rice', start: new Date(2018, 6, 15), end: new Date(2018, 11)}
    ])
  }
  p.draw = function () {
    p.chart.update()
  }
}
