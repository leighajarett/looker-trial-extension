import { useContext } from 'react'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'

export function useLookerRedirect() {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const extensionSDK = extensionContext.extensionSDK
  return (url: string, target?: string) =>
    extensionSDK.openBrowserWindow(url, target)
}
