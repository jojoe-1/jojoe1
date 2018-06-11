function sketch(p) {

  const SELECTOR = '.container .planting .planting-canvas'
  const SELECTOR_JQ = $(SELECTOR)
  const SELECTOR_EL = SELECTOR_JQ[0]

  p.setup = function () {

    p.CANVAS_WIDTH = 560
    p.CANVAS_HEIGHT = 315

    let canvas = p.createCanvas(p.CANVAS_WIDTH, p.CANVAS_HEIGHT)
    canvas.parent($(SELECTOR)[0])

    p.CHART_DATA = [
      {name: 'Winter', details: 'On winter we mostly grow vegetables!', start: new Date(2018, 1), end: new Date(2018, 3, 15)},
      {name: 'Summer', details: 'On Summer, the time has come to grow the roots!', start: new Date(2018, 4), end: new Date(2018, 8)},
      {name: 'Corn', details: 'The delicious corn takes about two weeks to harvest!', start: new Date(2018, 4), end: new Date(2018, 6, 14)},
      {name: 'Rice', details: 'We love rice!', start: new Date(2018, 6, 15), end: new Date(2018, 11)}
    ]

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
      this.labelsAdded = false
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
            name: plantData.name,
            details: plantData.details,
            rect: rect
          })
        }

        p.fill('#79f193')
        p.rect(rect.x, rect.y, rect.w, rect.h)
      }

      this.addLabels()
    }

    Chart.prototype.addLabels = function () {
      if (!this.labelsAdded) {
        for (let i = 0; i < this.dataRects.length; i++) {
          // Add labels
          let r = this.dataRects[i]
          SELECTOR_JQ.append('<div class="label" id="chart_planting_' + r.id + '">' + r.name + '</div>')
          let jqLabel = $(SELECTOR + ' #chart_planting_' + r.id)
          jqLabel.css({
            left: r.rect.x + 'px',
            top: r.rect.y + 'px',
            width: r.rect.w + 'px',
            height: r.rect.h + 'px'
          })
          // When click on Label -> show details card
          jqLabel[0].addEventListener('click', function () {
            // show details card
            SELECTOR_JQ.parent().find('#chart_planting_card .desc').html(r.details)
            SELECTOR_EL.classList.toggle('hide')
            SELECTOR_EL.classList.toggle('show')
            setTimeout(function () {
              SELECTOR_JQ.css({'z-index': '-1'})
              let jqCard = SELECTOR_JQ.parent().find('#chart_planting_card')
              jqCard[0].classList.toggle('hide')
              jqCard[0].classList.toggle('show')
              jqCard.css({
                width: p.CANVAS_WIDTH,
                height: p.CANVAS_HEIGHT
              })
              let jqClose = SELECTOR_JQ.parent().find('#chart_planting_card .close')
              if (!jqClose.onclick) {
                jqClose[0].onclick = function () {
                  this.parentElement.classList.toggle('hide')
                  this.parentElement.classList.toggle('show')
                  setTimeout(function () {
                    SELECTOR_EL.classList.toggle('hide')
                    SELECTOR_EL.classList.toggle('show')
                    SELECTOR_JQ.css({'z-index': '2'})
                  }, 200)
                }
              }
            }, 200)
          })
        }
        this.labelsAdded = true
      }
    }

    p.chart = new Chart(p.CHART_DATA)
  }
  p.draw = function () {
    p.chart.update()
  }
}
