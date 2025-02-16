const { test, expect } = require("@jest/globals")
const { EventEmitter } = require("./dist/index")

const emitter = new EventEmitter()

test("listen", async () => {
  emitter.on("listen", (n) => {
    expect(n).toBeGreaterThanOrEqual(1)
    expect(n).toBeLessThanOrEqual(2)
  })

  await emitter.emit("listen", 1)
  await emitter.emit("listen", 2)
})

test("listen once", async () => {
  emitter.once("listen once", (n) => {
    expect(n).toBe(1)
  })

  await emitter.emit("listen once", 1)
  await emitter.emit("listen once", 2)
})

test("listen once twice", async () => {
  let calledAmount = 0
  emitter.once("listen once twice", () => {
    calledAmount++
  })
  emitter.once("listen once twice", () => {
    calledAmount++
  })

  await emitter.emit("listen once twice")
  expect(calledAmount).toBe(2)
})

test("cleaning", () => {
  emitter.on("cleaning", () => null)

  emitter.off()

  expect(emitter._listeners.length).toBe(0)
})
