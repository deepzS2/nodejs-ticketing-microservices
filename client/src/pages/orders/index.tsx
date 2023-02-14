import type { NextPage } from 'next'
import Link from 'next/link'

interface Props {
  orders: any[]
  currentUser: any
}

const Orders: NextPage<Props> = ({ orders }) => {
  return (
    <ul>
      {orders.map(order => (
        <li key={order.id}>
          {order.ticket.title} - {order.status}
        </li>
      ))}
    </ul>
  )
}

Orders.getInitialProps = async (context) => {
  const { api, currentUser } = context

  const { data: orders } = await api.get('/api/orders')

  return {
    orders,
    currentUser
  }
}

export default Orders