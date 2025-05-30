import Route from '../route/index.js'
const Options = {}
export default class LocalStorageRouter extends EventTarget {
  #options = {}
  #routes = {}
  constructor($routes = {}, $options) {
    super()
    this.#options = Object.assign({}, Options, $options)
    this.addRoutes($routes)
  }
  addRoutes($routes, $options) {
    for(const [$routePath, $routeOptions] of Object.entries($routes)) {
      this.#routes[$routePath] = new Route($routePath, $routeOptions)
    }
  }
  removeRoutes($routes) {
    for(const $routePath of $routes) {
      delete this.#routes[$routePath]
    }
  }
  getRoutes($paths) {
    if(!$paths) { return this.#routes }
    const routes = {}
    for(const $path of [].concat($paths)) {
      routes[$path] = this.#routes[$path]
    }
    return routes
  }
  clear() { localStorage.clear() }
}