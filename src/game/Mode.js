export class Mode {
  constructor (main, gui, canRender) {
    this.main = main;
    this.gui = gui;
    this.canRender = canRender;
  }

  handleMouseMove (deltaX, deltaY) {}

  handleAction (event, key, value) {}

  update () {}
}
