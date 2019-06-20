const fs = require('fs')
const path = require('path')
const { paths } = require('react-app-rewired')

module.exports = function override (config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    ...absolutePaths,
    assets: path.resolve(paths.appPath, `${paths.appSrc}/app/assets`),
    '@kogaio': path.resolve(paths.appPath, 'node_modules/@ivoryio/kogaio')
  }
  return config
}

const absolutePaths = (function generatePodAliases () {
  const modulesRoot = path.resolve(paths.appPath, `${paths.appSrc}/packages`)
  const aliases = Object.assign(
    {},
    ...fs.readdirSync(modulesRoot).map(folder => ({
      [`${folder}`]: path.resolve(
        paths.appPath,
        `${paths.appSrc}/packages/${folder}`
      )
    }))
  )
  return aliases
}())
