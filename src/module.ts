import { addImportsDir, addTypeTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import { readFile } from 'fs/promises';
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
  async setup() {
    const { resolve } = createResolver(import.meta.url)
    const data = await readFile(resolve('runtime/types.ts'), 'utf8');
    addTypeTemplate({
      filename: 'types/nuxt-swapi.d.ts',
      getContents: () => data
    })
    addImportsDir(resolve('runtime/composables'))
  },
})