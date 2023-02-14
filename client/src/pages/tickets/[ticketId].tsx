import useRequest from "@/hooks/use-request"
import { NextPage } from "next"
import { useRouter } from "next/router"

interface Props {
  ticket: any
}

const TicketShow: NextPage<Props> = ({ ticket }) => {
  const router = useRouter()
  const { executeRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    onSuccess: (data) => router.push('/orders/[orderId]', `/orders/${data.id}`),
  })

  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      <button onClick={() => executeRequest({ ticketId: ticket.id })} className="btn btn-primary">Purchase</button>
    </div>
  )
}

TicketShow.getInitialProps = async (context) => {
  const { api, query: { ticketId } } = context

  const { data: ticket } = await api.get(`/api/tickets/${ticketId}`)

  return {
    ticket
  }
}

export default TicketShow