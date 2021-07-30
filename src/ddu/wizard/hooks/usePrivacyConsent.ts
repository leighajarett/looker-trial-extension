import {useEffect, useState} from "react";

const ACADEMY_SERVER = 'https://datadriven.university'

export const usePrivacyConsent = () => {
  const [isConsented, setConsented] = useState(false)

  const doUserStatusRequest = () => {
    return fetch(`${ACADEMY_SERVER}/users/status`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
  }

  useEffect(() => {
    const checkConsent = async () => {
      const response = await doUserStatusRequest()
      const json = await response.json()

      if (json && typeof json.accepted_privacy_policy !== 'undefined' && json.accepted_privacy_policy !== 'declined') {
        setConsented(true)
      }
    }

    checkConsent().catch(error => console.error(error))
  }, [])

  return isConsented
}