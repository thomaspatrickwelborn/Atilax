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

function assign($target, ...$sources) {
  if(!$target) { return $target}
  iterateSources: 
  for(const $source of $sources) {
    if(!$source) continue iterateSources
    for(const [
      $sourcePropertyKey, $sourcePropertyValue
    ] of Object.entries($source)) {
      const typeOfTargetPropertyValue = typeOf($target[$sourcePropertyKey]);
      const typeOfSourcePropertyValue = typeOf($sourcePropertyValue);
      if(
        typeOfTargetPropertyValue === 'object' &&
        typeOfSourcePropertyValue === 'object'
      ) {
        $target[$sourcePropertyKey] = assign($target[$sourcePropertyKey], $sourcePropertyValue);
      }
      else {
        $target[$sourcePropertyKey] = $sourcePropertyValue;
      }
    }
  }
  return $target
}

var Options$1$1 = {
  ancestors: [],
  delimiter: '.',
  depth: 0,
  frozen: false,
  maxDepth: 10,
  nonenumerable: true,
  path: false,
  sealed: false,
  type: false,
};

function getOwnPropertyDescriptor($properties, $propertyKey, $options) {
  const options = Object.assign({}, Options$1$1, $options, {
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
  const options = Object.assign({}, Options$1$1, $options);
  if(options.depth >= options.maxDepth) { return propertyDescriptors }
  else { options.depth++; }
  for(const [$propertyKey, $propertyDescriptor] of Object.entries(Object.getOwnPropertyDescriptors($properties))) {
    const propertyDescriptor = getOwnPropertyDescriptor($properties, $propertyKey, options);
    if(propertyDescriptor !== undefined) { propertyDescriptors[$propertyKey] = propertyDescriptor; }
  }
  return propertyDescriptors
}

var Options$2 = {
  typeCoercion: false,
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

var Options$1 = ($options) => {
  const options = assign({
    propertyDescriptors: false,
    defineProperties: false,
    replacers: [],
    revivers: [],
  }, $options);
  if(options.propertyDescriptors?.type) {
    options.replacers.push(function BigintReplacer($key, $value) {
      if(typeOf($value) === 'bigint') { return String($value) }
      else { return $value }
    });
  }
  return options
};

function JSONMiddlewares($middlewares, $key, $value) {
  let value = $value;
  for(const $middleware of $middlewares) {
    value = $middleware($key, $value);
  }
  return value
}
class LocalStorageRoute extends EventTarget {
  constructor($path, $options) {
    super();
    if(!$path) return null
    const options = Options$1($options);
    const db = localStorage;
    Object.defineProperties(this, {
      'path': { value: $path },
      'raw': { value: function raw() { return db.getItem(this.path) } },
      'get': { value: function get() {
        const { path } = this;
        const raw = db.getItem(this.path);
        if(['undefined', undefined].includes(raw)) { return }
        const propertyDescriptors = JSON.parse(raw, JSONMiddlewares.bind(null, options.revivers));
        const dataTypedObjectLiteral = typedObjectLiteral(propertyDescriptors);
        const data = (options.propertyDescriptors) ? defineProperties(
          dataTypedObjectLiteral, propertyDescriptors, options.defineProperties
        ) : propertyDescriptors;
        this.dispatchEvent(new CustomEvent('get', { detail: { path, raw, data } }));
        return data
      } },
      'set': { value: function set($data) {
        const data = $data;
        const { path } = this;
        let raw = (options.propertyDescriptors) ? JSON.stringify(
          getOwnPropertyDescriptors(data, options.propertyDescriptors), JSONMiddlewares.bind(null, options.replacers)
        ) : JSON.stringify(
          data, JSONMiddlewares.bind(null, options.replacers)
        );
        db.setItem(this.path, raw);
        this.dispatchEvent(new CustomEvent('set', { detail: { path, raw, data } }));
        return 
      } },
      'remove': { value: function remove() {
        const { path } = this;
        const raw = this.raw();
        const data = this.get();
        db.removeItem(this.path);
        this.dispatchEvent(new CustomEvent('remove', { detail: { path, raw, data } }));
        return
      } },
    });
  }
}

const Options = {};
class LocalStorageRouter extends EventTarget {
  constructor($routes = {}, $options) {
    super();
    Object.assign({}, Options, $options);
    const routes = {};
    const db = localStorage;
    Object.defineProperties(this, {
      'addRoute': { value: function addRoute($routePath, $routeOptions) {
        routes[$routePath] = new LocalStorageRoute($routePath, $routeOptions);
      } },
      'addRoutes': { value: function addRoutes($routes, $options) {
        for(const [$routePath, $routeOptions] of Object.entries($routes)) {
          this.addRoute($routePath, $routeOptions);
        }
      } },
      'removeRoute': { value: function removeRoute($routePath) {
        delete routes[$routePath];
      } }, 
      'removeRoutes': { value: function removeRoutes($routes) {
        for(const $routePath of $routes) {
          this.removeRoute($routePath);
        }
      } },
      'getRoute': { value: function getRoute($path) {
        return routes[$path]
      } },
      'getRoutes': { value: function getRoutes($paths) {
        if(!$paths) { return routes }
        const getRoutes = {};
        for(const $path of [].concat($paths)) {
          getRoutes[$path] = this.getRoute($path);
        }
        return getRoutes
      } },
      'clear': { value: function clear() { db.clear(); } },
    });
    this.addRoutes($routes);
  }
}

export { LocalStorageRoute as Route, LocalStorageRouter as Router };
//# sourceMappingURL=atilax.js.map
