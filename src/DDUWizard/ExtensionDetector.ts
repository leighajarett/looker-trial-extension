import { useState, useEffect, useCallback } from 'react'

const IFRAME_MESSAGE_ID = 'lrowwpi5gs9a55yjg0th40xagi9t82t5'

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

const useTimer = (ms = 0) => {
  const [isTimeout, setIsTimeout] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsTimeout(true), ms)
  }, [ms])

  return isTimeout
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
  const isTimeout = useTimer(3000)

  return !isTimeout ? true : isInstalled
}

export function useExtensionDetector() {
  useExtensionNotifier()
  return useInstallationMessageReceiver()
}
