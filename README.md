# ⇄&ensp;Atilax
Localstorage router serializes/deserializes pathed object/array properties.  

> [!WARNING]  
> Early Stage Development  

> [!CAUTION]  
> Use At Own Risk  

> [!NOTE]  
> Interested in Atilax? 
> thomas.patrick.welborn@outlook.com


```
import { Route as LocalStorageRoute } from 'atilax'
const object = {
  propertyA: {
    propertyB: {
      propertyC: BigInt(9007199254740991)
    }
  }
}
const localStorageRoute = new LocalStorageRoute('/', {
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