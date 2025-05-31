console.log("---------------------")
console.log("Atilax | Example A.1.")
console.log("---------------------")
import { Router } from '/dependencies/atilax.js'
const localStorageRouter = new Router({
  '/': {},
  '/products': {},
  '/products/product': {},
  '/about': {},
}, {})
const indexLocalStore = localStorageRouter.getRoutes('/')
console.log('indexLocalStore', indexLocalStore['/'].get())
console.log('indexLocalStore', indexLocalStore['/'].set({
  propertyA: 1
}))
console.log('indexLocalStore', indexLocalStore['/'].get())
console.log('indexLocalStore', indexLocalStore['/'].remove())