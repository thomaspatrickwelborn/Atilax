import {
  defineProperties, getOwnPropertyDescriptors, typedObjectLiteral,
} from 'recourse'
import Options from './options.js'
function JSONMiddlewares($middlewares, $key, $value) {
  let value = $value
  for(const $middleware of $middlewares) {
    value = $middleware($key, $value)
  }
  return value
}
export default class LocalStorageRoute extends EventTarget {
  constructor($path, $options) {
    super()
    if(!$path) return null
    const options = Options($options)
    const db = localStorage
    Object.defineProperties(this, {
      'path': { value: $path },
      'raw': { value: function raw() { return db.getItem(this.path) } },
      'get': { value: function get() {
        let model = db.getItem(this.path)
        if(['undefined', undefined].includes(model)) { return }
        const modelParsement = JSON.parse(model, JSONMiddlewares.bind(null, options.revivers))
        if(model) {
          const modelTypedObjectLiteral = typedObjectLiteral(modelParsement)
          if(options.propertyDescriptors) {
            model = defineProperties(modelTypedObjectLiteral, modelParsement, options.defineProperties)
          }
          else {
            model = modelParsement
          }
        }
        return model
      } },
      'set': { value: function set($data) {
        if(options.propertyDescriptors) {
          return db.setItem(this.path, JSON.stringify(
            getOwnPropertyDescriptors($data, options.propertyDescriptors), JSONMiddlewares.bind(null, options.replacers)
          ))
        }
        else {
          return db.setItem(this.path, JSON.stringify($data, JSONMiddlewares.bind(null, options.replacers)))
        }
      } },
      'remove': { value: function remove() { return db.removeItem(this.path) } },
    })
  }
}