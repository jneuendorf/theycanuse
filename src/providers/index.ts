import { CaniuseProvider } from './caniuse'
import { MdnProvider } from './mdn'

export { AbstractProvider } from './abstract'
export { CaniuseProvider, MdnProvider }

export const instances = [new CaniuseProvider(), new MdnProvider()]
