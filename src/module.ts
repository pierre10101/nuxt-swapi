import { addImportsDir, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
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
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    nuxt.options.build.transpile.push(resolve('runtime'))
    addTypeTemplate({
      filename: 'types/nuxt-swapi.d.ts',
      dst: 'nuxt-swapi',
      src: resolve('runtime/types.ts')
    })
    addImportsDir(resolve('runtime/composables'))
  },
})