import { readFile } from 'node:fs/promises'
import certificates from './certificates.js'
export default {
  name: "Atilax | Demonstrament",
  inspector: {
    port: 9249,
    host: "127.0.0.1",
  },
  server: {
    https: {
      key: await readFile(certificates.key.path),
      cert: await readFile(certificates.cert.path),
      port: 3352,
      host: "demonstrament.atilax",
    },
  },
  browserSync: {
    logPrefix: "Atilax | Demonstrament",
    port: 3353,
    open: false,
    ui: false, 
    ghostMode: false,
    host: "demonstrament.atilax",
    https: {
      key: certificates.key.path,
      cert: certificates.cert.path,
    },
    files: [
      'static', 'localhost',
    ],
    proxy: {
      ws: true,
    },
    reloadDelay: 500,
    reloadDebounce: 500,
    reloadThrottle: 500,
    // injectChanges: true,
  },
  sockets: {
    host: "demonstrament.atilax",
    config: '$socket.js',
    source: 'documents',
    target: 'localhost',
    logErrors: false,
  },
  routers: {
    config: '$router.js',
    source: 'documents',
    target: 'localhost',
    logErrors: false,
  },
  documents: {
    config: '$document.js',
    source: 'documents',
    target: 'localhost',
    logErrors: false,
  },
}