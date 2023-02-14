import type { NextPage } from 'next'
import Link from 'next/link'

interface Props {
  tickets: any[]
  currentUser: any
}

const Home: NextPage<Props> = ({ tickets }) => {
  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          View
        </Link>
      </td>
    </tr>
  ))

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>

        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
}

Home.getInitialProps = async (context) => {
  const { api, currentUser } = context

  const { data: tickets } = await api.get('/api/tickets')

  return {
    tickets,
    currentUser
  }
}

export default Home