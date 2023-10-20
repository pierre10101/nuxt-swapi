import { addImports, createResolver, defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'

export interface ModuleOptions {
  config?: Record<string, any>
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'SwApi',
    compatibility: {
      nuxt: '^3',
    },
  },
  defaults: {
    config: {},
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.build.transpile.push(resolve('runtime'))

    addImports([
      'useSwapi',
    ].map(name => ({
      name,
      as: name,
      from: resolve(`runtime/composables/${name}`),
    })))

  },
})