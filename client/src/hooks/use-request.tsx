import axios, { isAxiosError } from 'axios'
import React, { ReactElement, useState } from 'react'

interface Params {
  url: string
  method: 'get' | 'post' | 'put' | 'delete'
  onSuccess?: (data: any) => any | Promise<any>
}

export default function useRequest({ url, method, onSuccess }: Params) {
  const [errors, setErrors] = useState<ReactElement | undefined>()

  const executeRequest = async (body?: any) => {
    try {
      setErrors(undefined)

      const response = await axios.request({
        method,
        url,
        data: body
      })

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (error) {
      const data = isAxiosError(error) ? error.response?.data.errors as any[] : [(error as Error).message]

      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {data.map(err => <li key={err.message}>{err.message}</li>)}
          </ul>
        </div>
      )

      throw error
    }
  }

  return { executeRequest, errors }
}