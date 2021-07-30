import React, { createContext, useContext, useMemo, useState } from 'react'
import { Dialog, DialogLayout } from '@looker/components'
import Steps from './Steps'

type ContextProps = {
  isOpen: boolean
  open: () => void
  close: () => void
}

const defaultContextValues = {
  isOpen: false,
  open: () => console.log('Context is not ready'),
  close: () => console.log('Context is not ready'),
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
  }

  return (
    <Context.Provider value={wizardContext}>
      {children}
      <Dialog
        isOpen={isOpen}
        onClose={close}
        content={
          <DialogLayout>
            <Steps close={close} />
          </DialogLayout>
        }
      />
    </Context.Provider>
  )
}

export default DDUWizardProvider
