| [⇄ Atilax](../README.md) | *`Route`* |
| :-- | :-- |

# `Route` Class

## `Route` `constructor`
### `$path` `argument`
### `$options` `argument`
```
{
  propertyDescriptors: false,
  defineProperties: false,
  replacers: [],
  revivers: [],
}
```
#### `$options.propertyDescriptors`
**Type**: `boolean`, `object`  
**Default**: `false`  
**Descript**: Indicates whether property descriptors stored. When `propertyDescriptors` is:  
 - `false`: Property descriptors **not** stored.  
 - `object`: Property descriptors stored with [Recourse `getOwnPropertyDescriptors`](https://github.com/thomaspatrickwelborn/Recourse/blob/master/document/methods/get-own-property-descriptors.md#options-argument) method
#### `$options.defineProperties`
**Type**: `boolean`, `object`  
**Default**: `false`  
**Descript**: When propertyDescriptors` is not `false indicates how properties are defined. 
 - `false`: `defineProperties` not used to revive stored object.  
 - `object`: Stored object revived with [Recourse `defineProperties`](https://github.com/thomaspatrickwelborn/Recourse/blob/master/document/methods/define-properties.md#options-argument)
#### `$options.replacers`
**Type**: `array[function]`  
**Default**: `[]`, [BigintReplacer]  
**Descript**: Array of functions with `($key, $value)` arguments that [mutate return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#replacer).  When `propertyDescriptors.type` is:
 - `false`: no replacers are used. 
 - `true`: `BigIntReplacer` function **automatically included**. 
#### `$options.revivers`
**Type**: `array[function]`  
**Default**: `[]`  
**Descript**: 
