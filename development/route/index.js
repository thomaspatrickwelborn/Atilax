import {
  defineProperties, getOwnPropertyDescriptors, typedObjectLiteral,
} from 'recourse'
import Options from './options.js'
export default class LocalStorageRoute extends EventTarget {
  #options
  #db = localStorage
  #path
  constructor($path, $options) {
    super()
    if(!$path) return
    this.#path = $path
    this.#options = Options($options)
  }
  get path() { return this.#path }
  get() {
    let model = this.#db.getItem(this.path)
    if(model) {
      const modelParsement = JSON.parse(model)
      const modelTypedObjectLiteral = typedObjectLiteral(modelParsement)
      model = defineProperties(modelTypedObjectLiteral, modelParsement, this.#options)
    }
    return model
  }
  set($data) { return this.#db.setItem(this.path, JSON.stringify(
    getOwnPropertyDescriptors($data, {
      path: true,
      type: true,
    })
  )) }
  remove() { return this.#db.removeItem(this.path) }
}