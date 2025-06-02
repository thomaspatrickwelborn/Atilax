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
        const { path } = this
        const raw = db.getItem(this.path)
        if(['undefined', undefined].includes(raw)) { return }
        const propertyDescriptors = JSON.parse(raw, JSONMiddlewares.bind(null, options.revivers))
        const dataTypedObjectLiteral = typedObjectLiteral(propertyDescriptors)
        const data = (options.propertyDescriptors) ? defineProperties(
          dataTypedObjectLiteral, propertyDescriptors, options.defineProperties
        ) : propertyDescriptors
        this.dispatchEvent(new CustomEvent('get', { detail: { path, raw, data } }))
        return data
      } },
      'set': { value: function set($data) {
        const data = $data
        const { path } = this
        let raw = (options.propertyDescriptors) ? JSON.stringify(
          getOwnPropertyDescriptors(data, options.propertyDescriptors), JSONMiddlewares.bind(null, options.replacers)
        ) : JSON.stringify(
          data, JSONMiddlewares.bind(null, options.replacers)
        )
        db.setItem(this.path, raw)
        this.dispatchEvent(new CustomEvent('set', { detail: { path, raw, data } }))
        return 
      } },
      'remove': { value: function remove() {
        const { path } = this
        const raw = this.raw()
        const data = this.get()
        db.removeItem(this.path)
        this.dispatchEvent(new CustomEvent('remove', { detail: { path, raw, data } }))
        return
      } },
    })
  }
}