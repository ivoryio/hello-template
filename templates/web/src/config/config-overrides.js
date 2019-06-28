const fs = require('fs')
const path = require('path')
const { paths } = require('react-app-rewired')

module.exports = {
  webpack: function (config, env) {
    const absolutePaths = generateWebpackAliases()
    config.resolve.alias = {
      ...config.resolve.alias,
      ...absolutePaths,
      assets: path.resolve(paths.appPath, `${paths.appSrc}/app/assets`),
      '@kogaio': path.resolve(paths.appPath, 'node_modules/@ivoryio/kogaio')
    }
    return config
  },
  jest: function (config) {
    const mappedAliases = generateJestMappedDirs()
    config.moduleNameMapper = {
      ...config.moduleNameMapper,
      ...mappedAliases,
      '^@kogaio$': '<rootDir>/node_modules/@ivoryio/kogaio',
      '^@kogaio/(.*)$': '<rootDir>/node_modules/@ivoryio/kogaio/$1'
    }
    return config
  }
}

function generateWebpackAliases () {
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
}

function generateJestMappedDirs () {
  const modulesRoot = path.resolve(paths.appPath, `${paths.appSrc}/packages`)

  const mappedDirs = Object.assign(
    {},
    ...fs.readdirSync(modulesRoot).map(folder => ({
      [`^${folder}$`]: `${paths.appSrc}/packages/${folder}`,
      [`^${folder}/(.*)$`]: `${paths.appSrc}/packages/${folder}/$1`
    }))
  )
  return mappedDirs
}
