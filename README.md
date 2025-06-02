# ⇄&ensp;Atilax
Localstorage router serializes/deserializes pathed object/array properties.  
 - Store property descriptor `enumerable`, `configurable`, `writable`, `value` settings.  
 - Store typed `string`, `number`, `boolean`, `bigint`, `array`, `object`. 
 - Store property `path` and `frozen`, `sealed` property states. 

[**Router**](./document/router.md) | [**Route**](./document/route.md) |
| :-- | :-- |

## Illustration A
```
const array = [{
  propertyB: {
    propertyC: 333,
  },
}, {
  propertyB: {
    propertyC: 333333,
  },
}, {
  propertyB: {
    propertyC: 333333333,
  },
}]
const localStorageRoute = new LocalStorageRoute('/illustration-a')
localStorageRoute.set(array)
console.log("localStorageRoute.raw()", localStorageRoute.raw())
console.log("localStorageRoute.get()", localStorageRoute.get())
```
`localStorageRoute.raw()`  
```
[{"propertyB":{"propertyC":333}},{"propertyB":{"propertyC":333333}},{"propertyB":{"propertyC":333333333}}]
```

`localStorageRoute.get()`  
```
[
  {
    "propertyB": {
      "propertyC": 333
    }
  },
  {
    "propertyB": {
      "propertyC": 333333
    }
  },
  {
    "propertyB": {
      "propertyC": 333333333
    }
  }
]
```

## Illustration B
```
import { Route as LocalStorageRoute } from 'atilax'
const object = {
  propertyA: {
    propertyB: {
      propertyC: BigInt(9007199254740991)
    }
  }
}
const localStorageRoute = new LocalStorageRoute('/illustration-b', {
  propertyDescriptors: { type: true }
})
localStorageRoute.set(object)
console.log("localStorageRoute.raw()", localStorageRoute.raw())
console.log("localStorageRoute.get()", localStorageRoute.get())
```

`localStorageRoute.raw()`  
```
 {"propertyA":{"value":{"propertyB":{"value":{"propertyC":{"value":"9007199254740991","writable":true,"enumerable":true,"configurable":true,"type":"bigint"}},"writable":true,"enumerable":true,"configurable":true,"type":"object"}},"writable":true,"enumerable":true,"configurable":true,"type":"object"}}
```

`localStorageRoute.get()`  
```
{
  propertyA: {
    propertyB: {
      propertyC: 9007199254740991n
    }
  }
}
```
