import React, { createContext, useContext, useMemo, useState } from 'react'
import { Dialog, DialogLayout } from '@looker/components'
import Steps from './Steps'
import {useExtensionDetector} from "./hooks/useExtensionDetector";
import {usePrivacyConsent} from "./hooks/usePrivacyConsent";

type ContextProps = {
  detected: boolean,
  consented: boolean,
  isOpen: boolean
  open: () => void
  close: () => void
  setSuccessLogin: (boolean: boolean) => void
}

const defaultContextValues = {
  isOpen: false,
  open: () => console.log('Context is not ready'),
  close: () => console.log('Context is not ready'),
  detected: false,
  consented: false,
  setSuccessLogin: (boolean: boolean) => false
}

const Context = createContext<ContextProps>(defaultContextValues)

export function useWizard() {
  const wizardContext = useContext(Context)
  return useMemo(() => {
    return wizardContext
  }, [wizardContext])
}

const DDUWizardProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [successLogin, setSuccessLogin] = useState(false)
  const detected = useExtensionDetector()
  const consented = usePrivacyConsent()

  const open = () => {
    setIsOpen(true)
  }

  const close = () => {
    setIsOpen(false)
  }

  const wizardContext = {
    open,
    close,
    isOpen,
    detected,
    consented: consented || successLogin,
    setSuccessLogin
  }

  return (
    <Context.Provider value={wizardContext}>
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={close}
        content={
          <DialogLayout>
            <Steps close={close} isOpen={isOpen} />
          </DialogLayout>
        }
      />
    </Context.Provider>
  )
}

export default DDUWizardProvider
