import { NextPage } from "next"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import useRequest from "@/hooks/use-request"
import { useRouter } from "next/router"

interface Props {
  currentUser: any
}

interface FormInputs {
  title: string
  price: number
}

const formSchema = z.object({
  title: z.string(),
  price: z.number().positive()
})

const NewTicket: NextPage<Props> = () => {
  const router = useRouter()
  const { executeRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    onSuccess: () => router.push('/')
  })
  const { register, handleSubmit } = useForm<FormInputs>({
    mode: "onBlur",
    resolver: zodResolver(formSchema)
  })

  const onSubmit = handleSubmit(executeRequest)

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input className="form-control" {...register('title')} />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input className="form-control" {...register('price')} />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}


export default NewTicket