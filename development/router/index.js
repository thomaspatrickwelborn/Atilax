import Route from '../route/index.js'
const Options = {}
export default class LocalStorageRouter extends EventTarget {
  constructor($routes = {}, $options) {
    super()
    const options = Object.assign({}, Options, $options)
    const routes = {}
    const db = localStorage
    Object.defineProperties(this, {
      'addRoute': { value: function addRoute($routePath, $routeOptions) {
        routes[$routePath] = new Route($routePath, $routeOptions)
      } },
      'addRoutes': { value: function addRoutes($routes, $options) {
        for(const [$routePath, $routeOptions] of Object.entries($routes)) {
          this.addRoute($routePath, $routeOptions)
        }
      } },
      'removeRoute': { value: function removeRoute($routePath) {
        delete routes[$routePath]
      } }, 
      'removeRoutes': { value: function removeRoutes($routes) {
        for(const $routePath of $routes) {
          this.removeRoute($routePath)
        }
      } },
      'getRoute': { value: function getRoute($path) {
        return routes[$path]
      } },
      'getRoutes': { value: function getRoutes($paths) {
        if(!$paths) { return routes }
        const getRoutes = {}
        for(const $path of [].concat($paths)) {
          getRoutes[$path] = this.getRoute($path)
        }
        return getRoutes
      } },
      'clear': { value: function clear() { db.clear() } },
    })
    this.addRoutes($routes)
  }
}