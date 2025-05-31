const Primitives = {
  'string': String, 
  'number': Number, 
  'boolean': Boolean, 
  'bigint': BigInt,
  'undefined': undefined,
  'null': null,
};
Object.values(Primitives);
const Objects = {
  'object': Object,
  'array': Array,
};
Object.values(Objects);
const Types = Object.assign({}, Primitives, Objects);
Object.values(Types);
[
 Primitives.String, Primitives.Number, Primitives.Boolean, 
 Objects.Object, Objects.Array
];

var typeOf = ($data) => Object
  .prototype
  .toString
  .call($data).slice(8, -1).toLowerCase();

function typedObjectLiteral($value) {
  let _typedObjectLiteral;
  const typeOfValue = typeOf($value);
  if(typeOfValue === 'string') {
    const value = $value.toLowerCase();
    if(value === 'object') { _typedObjectLiteral = {}; }
    else if(value === 'array') { _typedObjectLiteral = []; }
  }
  else  {
    if(typeOfValue === 'object') { _typedObjectLiteral = {}; }
    else if(typeOfValue === 'array') { _typedObjectLiteral = []; }
  }
  return _typedObjectLiteral
}

var isArrayLike = ($source) => {
  let isArrayLike;
  const typeOfSource = typeOf($source);
  if(typeOfSource === 'array') { isArrayLike = true; }
  else if(
    typeOfSource === 'object' &&
    Number.isInteger($source.length) && $source.length >= 0
  ) {
    iterateSourceKeys: 
    for(const $sourceKey of Object.keys(
      Object.getOwnPropertyDescriptors($source)
    )) {
      if($sourceKey === 'length') { continue iterateSourceKeys }
      isArrayLike = !isNaN($sourceKey);
      if(!isArrayLike) { break iterateSourceKeys }
    }
  }
  else { isArrayLike = false; }
  return isArrayLike
};

var Settings = {
  depth: 0,
  path: null,
  ancestors: [],
};

var Options$1 = {
  delimiter: '.',
  frozen: false,
  maxDepth: 10,
  nonenumerable: true,
  path: false,
  sealed: false,
  type: false,
};

function getOwnPropertyDescriptor($properties, $propertyKey, $options) {
  const options = Object.assign({}, Settings, Options$1, $options, {
    ancestors: Object.assign([], $options.ancestors)
  });
  const propertyDescriptor = Object.getOwnPropertyDescriptor($properties, $propertyKey);
  if(!options.nonenumerable && !propertyDescriptor.enumerable) { return }
  if(!options.ancestors.includes($properties)) { options.ancestors.unshift($properties); }
  if(options.ancestors.includes(propertyDescriptor.value)) { return }
  if(options.path) {
    options.path = (typeOf(options.path) === 'string') ? [options.path, $propertyKey].join(options.delimiter) : $propertyKey;
    propertyDescriptor.path = options.path;
  }
  if(options.type) { propertyDescriptor.type = typeOf(propertyDescriptor.value); }
  if(options.frozen) { propertyDescriptor.frozen = Object.isFrozen(propertyDescriptor.value); }
  if(options.sealed) { propertyDescriptor.sealed = Object.isSealed(propertyDescriptor.value); }
  if(['array', 'object'].includes(typeOf(propertyDescriptor.value))) {
    propertyDescriptor.value = getOwnPropertyDescriptors(propertyDescriptor.value, options);
  }
  return propertyDescriptor
}

function getOwnPropertyDescriptors($properties, $options) {
  const propertyDescriptors = {};
  const options = Object.assign({}, Settings, Options$1, $options);
  if(options.depth >= options.maxDepth) { return propertyDescriptors }
  else { options.depth++; }
  for(const [$propertyKey, $propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors($properties))) {
    const propertyDescriptor = getOwnPropertyDescriptor($properties, $propertyKey, options);
    if(propertyDescriptor !== undefined) { propertyDescriptors[$propertyKey] = propertyDescriptor; }
  }
  return propertyDescriptors
}

var Options$2 = {
  configurable: false,
  enumerable: false,
  frozen: false,
  sealed: false,
  typeCoercion: false,
  writable: false,
};

function defineProperty($target, $propertyKey, $propertyDescriptor, $options) {
  const propertyDescriptor = Object.assign({}, $propertyDescriptor);
  const options = Object.assign({}, Options$2, $options);
  const typeOfPropertyValue = typeOf(propertyDescriptor.value);
  if(['array', 'object'].includes(typeOfPropertyValue)) {
    const propertyValue = isArrayLike(Object.defineProperties(
      typedObjectLiteral(typeOfPropertyValue), propertyDescriptor.value
    )) ? [] : {};
    propertyDescriptor.value = defineProperties(propertyValue, propertyDescriptor.value, options);
  }
  else if(
    options.typeCoercion && 
    Object.getOwnPropertyDescriptor(propertyDescriptor, 'type') !== undefined &&
    !['undefined', 'null'].includes(typeOfPropertyValue)
  ) {
    propertyDescriptor.value = Primitives[propertyDescriptor.type](propertyDescriptor.value);
  }
  Object.defineProperty($target, $propertyKey, propertyDescriptor);
  if($propertyDescriptor.sealed) { Object.seal($target[$propertyKey]); }
  if($propertyDescriptor.frozen) { Object.freeze($target[$propertyKey]); }
  return $target
}

function defineProperties($target, $propertyDescriptors, $options) {
  const options = Object.assign({}, Options$2, $options);
  for(const [
    $propertyKey, $propertyDescriptor
  ] of Object.entries($propertyDescriptors)) {
    defineProperty($target, $propertyKey, $propertyDescriptor, options);
  }
  return $target
}

var Options = ($options) => Object.assign({
  basename: '',
  delimiter: '.',
  frozen: false,
  maxDepth: 10,
  nonenumerable: true,
  path: false,
  sealed: false,
  type: false,
}, $options);

class LocalStorageRoute extends EventTarget {
  #options
  #db = localStorage
  #path
  constructor($path, $options) {
    super();
    if(!$path) return
    this.#path = $path;
    this.#options = Options($options);
  }
  get path() { return this.#path }
  get() {
    let model = this.#db.getItem(this.path);
    if(model) {
      const modelParsement = JSON.parse(model);
      const modelTypedObjectLiteral = typedObjectLiteral(modelParsement);
      model = defineProperties(modelTypedObjectLiteral, modelParsement, this.#options);
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

class LocalStorageRouter extends EventTarget {
  #options = {}
  #routes = {}
  constructor($routes = {}, $options) {
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
  clear() { localStorage.clear(); }
}

export { LocalStorageRoute as Route, LocalStorageRouter as Router };
//# sourceMappingURL=atilax.js.map
