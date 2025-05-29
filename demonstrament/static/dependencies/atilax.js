import { recursiveDefineProperties, recursiveGetOwnPropertyDescriptors } from 'recourse';

class LocalStorageRoute extends EventTarget {
  #options
  #db = localStorage
  #path
  constructor($path, $options) {
    super();
    this.#options = $options;
    this.path = $path;
  }
  get path() { return this.#path }
  set path($path) {
    if(this.#path !== undefined) return
    this.#path = $path;
  }
  get() {
    let model = this.#db.getItem(this.path);
    if(model) {
      model = recursiveDefineProperties(JSON.parse(model), {
        typeCoercion: true
      });
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
    catch($err) { console.error($err); }
  }
}

class LocalStorageRouter extends EventTarget {
  #options = {}
  #routes = {}
  constructor($routes, $options) {
    super();
    Object.assign(this.#options, $options);
    this.addRoutes($routes);
  }
  addRoutes($routes, $options) {
    for(const [$routePath, $routeOptions] of Object.entries($routes)) {
      this.#routes[$routePath] = new LocalStorageRoute($routePath, $routeOptions);
    }
  }
  removeRoutes($routes) {
    for(const $routePath of $routes) {
      delete this.#routes[$routePath];
    }
  }
  getRoutes($paths) {
    if(!$paths) { return this.#routes }
    const routes = {};
    for(const $path of [].concat($paths)) {
      routes[$path] = this.#routes[$path];
    }
    return routes
  }
}

var index = {
  Route: LocalStorageRoute,
  Router: LocalStorageRouter
};

export { index as default };
//# sourceMappingURL=atilax.js.map
