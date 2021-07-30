import { useState, useEffect, useCallback } from 'react'

const IFRAME_MESSAGE_ID = '3039ad0165c245819c14af404b519a5c'

const useAllMessageListener = (handler: (event: any) => void) => {
  const messageHandler = useCallback(
    (event: any) => {
      if (event && event.data && event.data.id === IFRAME_MESSAGE_ID) {
        handler(event)
      }
    },
    [handler]
  )

  useEffect(() => {
    window.addEventListener('message', messageHandler)
    return () => window.removeEventListener('message', messageHandler)
  })
}

const useMessageListener = (
  actionType: string,
  handler: (event: any) => void
) => {
  const messageHandler = useCallback(
    (event: any) => {
      if (event.data.payload && event.data.payload.action === actionType) {
        handler(event)
      }
    },
    [actionType, handler]
  )

  useAllMessageListener(messageHandler)
}

const useExtensionMessageSender = () => {
  const sendMessage = (data: any) => {
    window.top.postMessage({ id: IFRAME_MESSAGE_ID, payload: data }, '*')
  }

  return useCallback(
    (payload) => {
      sendMessage({ ...payload })
    },
    [sendMessage]
  )
}

const useExtensionNotifier = () => {
  const sendMessage = useExtensionMessageSender()
  useEffect(() => {
    sendMessage({ action: 'IS_EXTENSION_INSTALLED' })
  }, [])
}

const useInstallationMessageReceiver = () => {
  const [isInstalled, setIsInstalled] = useState(false)

  useMessageListener('EXTENSION_INSTALLED', () => setIsInstalled(true))

  return isInstalled
}

export function useExtensionDetector() {
  useExtensionNotifier()
  return useInstallationMessageReceiver()
}
