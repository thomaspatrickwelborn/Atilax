console.log("---------------------")
console.log("Atilax | Example A.1.")
console.log("---------------------")
import { Route as LocalStorageRoute } from '/dependencies/atilax.js'
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