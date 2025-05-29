import {
  recursiveDefineProperties, recursiveGetOwnPropertyDescriptors
} from 'recourse'
export default class LocalStorageRoute extends EventTarget {
  #options
  #db = localStorage
  #path
  constructor($path, $options) {
    super()
    this.#options = $options
    this.path = $path
  }
  get path() { return this.#path }
  set path($path) {
    if(this.#path !== undefined) return
    this.#path = $path
  }
  get() {
    let model = this.#db.getItem(this.path)
    if(model) {
      model = recursiveDefineProperties(JSON.parse(model), {
        typeCoercion: true
      })
    }
    return model
  }
  set($data) {
    return this.#db.setItem(this.path, JSON.stringify(
      recursiveGetOwnPropertyDescriptors($data, {
        path: true,
        retrocursion: false,
        type: true,
      })
    ))
  }
  remove() {
    try { return this.#db.removeItem(this.path) }
    catch($err) { console.error($err) }
  }
}