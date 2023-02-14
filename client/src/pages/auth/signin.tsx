import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import useRequest from '../../hooks/use-request'

interface FormFields {
  email: string
  password: string
}

const Signin: NextPage = () => {  
  const router = useRouter()
  const { register, handleSubmit } = useForm<FormFields>()
  const { errors, executeRequest } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    onSuccess: () => router.push('/')
  })

  const onSubmit = handleSubmit((data) => executeRequest(data).catch(console.error))

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" className="form-control" {...register('email')} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" className="form-control" {...register('password')} />
      </div>
      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  )
}

export default Signin