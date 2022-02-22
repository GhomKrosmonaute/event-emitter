const { EventEmitter } = require("./dist/index")

const emitter = new EventEmitter()

test("listen", () => {
  emitter.on("listen", (n) => {
    expect(n).toBeGreaterThanOrEqual(1)
    expect(n).toBeLessThanOrEqual(2)
  })

  emitter.emit("listen", [1], null)
  emitter.emit("listen", [2], null)
})

test("listen once", () => {
  emitter.once("listen once", (n) => {
    expect(n).toBe(1)
  })

  emitter.emit("listen once", [1], null)
  emitter.emit("listen once", [2], null)
})

test("cleaning", () => {
  emitter.on("cleaning", () => null)

  emitter.off()

  expect(emitter._listeners.length).toBe(0)
})

