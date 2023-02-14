import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import useRequest from '../../hooks/use-request'

interface FormFields {
  email: string
  password: string
}

const Signup: NextPage = () => {  
  const router = useRouter()
  const { register, handleSubmit} = useForm<FormFields>()
  const { errors, executeRequest } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    onSuccess: () => router.push('/')
  })

  const onSubmit = handleSubmit((data) => executeRequest(data).catch(console.error))

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input type="email" className="form-control" {...register('email')} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" className="form-control" {...register('password')} />
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}

export default Signup