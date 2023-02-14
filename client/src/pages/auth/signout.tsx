import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useRequest from '../../hooks/use-request'

const Signout: NextPage = () => {  
  const router = useRouter()
  const { executeRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    onSuccess: () => router.push('/')
  })

  useEffect(() => {
    executeRequest()
  }, [executeRequest])

  return (
    <div>Signing you out...</div>
  )
}

export default Signout