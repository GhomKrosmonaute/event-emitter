export type BaseEventNames = Record<string, { context: any; params: any[] }>

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
> = (
  this: EventNames[Name]["context"],
  ...params: EventNames[Name]["params"]
) => unknown

export class EventEmitter<EventNames extends BaseEventNames = BaseEventNames> {
  protected _listeners: Listener<EventNames, keyof EventNames>[] = []

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

  public emit<Name extends keyof EventNames>(
    name: Name,
    params: EventNames[Name]["params"],
    context: EventNames[Name]["context"]
  ) {
    for (const listener of this._listeners) {
      if (listener.name === name) {
        listener.run.bind(context)(...params)

        if (listener.once) {
          const index = this._listeners.indexOf(listener)
          this._listeners.splice(index, 1)
        }
      }
    }
  }

  public getListenersByName<Name extends keyof EventNames>(
    name: Name
  ): Listener<EventNames, Name>[] {
    return this._listeners.filter(
      (listener): listener is Listener<EventNames, Name> => {
        return listener.name === name
      }
    )
  }
}
