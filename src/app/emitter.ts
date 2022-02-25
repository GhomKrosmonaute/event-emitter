export type BaseEventNames = Record<string, any[]>

export type Listener<
  EventNames extends BaseEventNames,
  Name extends keyof EventNames
> = {
  name: Name
  once?: true
  run: ListenerFunction<EventNames, Name>
}

export type ListenerFunction<
  EventNames extends BaseEventNames,
  Name extends keyof EventNames
> = (...params: EventNames[Name]) => unknown

export class EventEmitter<EventNames extends BaseEventNames = BaseEventNames> {
  protected _listeners: Listener<EventNames, any>[] = []

  public on<Name extends keyof EventNames>(
    name: Name,
    run: ListenerFunction<EventNames, Name>
  ) {
    this._listeners.push({ name, run })
  }

  public once<Name extends keyof EventNames>(
    name: Name,
    run: ListenerFunction<EventNames, Name>
  ) {
    this._listeners.push({ name, run, once: true })
  }

  public off<Name extends keyof EventNames>(
    name?: Name,
    run?: ListenerFunction<EventNames, Name>
  ) {
    if (run) this._listeners = this._listeners.filter((l) => l.run !== run)
    else if (name)
      this._listeners = this._listeners.filter((l) => l.name !== name)
    else this._listeners.splice(0, this._listeners.length)
  }

  public async emit<Name extends keyof EventNames>(
    name: Name,
    ...params: EventNames[Name]
  ) {
    for (const listener of this._listeners) {
      if (listener.name === name) {
        await listener.run(...params)

        if (listener.once) {
          const index = this._listeners.indexOf(listener)
          this._listeners.splice(index, 1)
        }
      }
    }
  }
}
