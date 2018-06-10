function getContext(selector) {

  const canvas = $(selector)[0];

  return {
    canvas: canvas,
    context: canvas.getContext('2d')
  }
}