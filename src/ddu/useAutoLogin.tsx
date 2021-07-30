
import { getCore40SDK } from '@looker/extension-sdk-react'

// const ACADEMY_SERVER = 'https://datadriven.university'
const ACADEMY_SERVER = 'https://localhost:8443'

const useAutoLogin = () => {
  const signIn = (email: string, firstName: string, lastName: string) => {
    return fetch(`${ACADEMY_SERVER}/users/stats`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName,
        lastName,
        data:
          'Lf73bJ7vT8yeqJRpOAhXYGW8wyBRhyZgG91Om8mmS1en4sWFmNSFEE3Uc994DMAR7VfZfdkfMybd6OyCl43FSLngFPIRyqEAtG4WiLDNvHVoO7Bn0a4wyFJGDBBYcJY7PZPMiHPKKBaOx2XNMW7qtrWsOCRygUqJ',
      }),
    })
  }

  return async () => {
    const me = await getCore40SDK().me()

    if (me.ok) {
      const userInfo = me.value
      await signIn(userInfo.email, userInfo.first_name, userInfo.last_name)
    } else {
      console.error('Cannot get information about Looker user.')
    }
  }
}

export default useAutoLogin