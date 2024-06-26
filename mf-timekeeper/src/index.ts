import { Plugin } from 'vite'
import { getRemoteEntryUrl } from './utils'
import { GetRemoteEntryOptions } from './types/options'

interface ExtendedPlugin extends Plugin {
  getRemoteEntryUrl(options: GetRemoteEntryOptions): string
}

export type { GetRemoteEntryOptions }

export const mfTimekeeperPlugin = (): ExtendedPlugin => {
  const plugin: ExtendedPlugin = {
    name: 'mfTimekeeper',
    getRemoteEntryUrl(options: GetRemoteEntryOptions): string {
      return getRemoteEntryUrl(options)
    }
  }

  return plugin
}

export { getRemoteEntryUrl }