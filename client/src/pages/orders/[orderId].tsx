import { NextPage } from "next"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import StripeCheckout from "react-stripe-checkout"

import useRequest from '@/hooks/use-request'

interface Props {
  order: any
  currentUser: any
}

const OrderShow: NextPage<Props> = ({ order, currentUser }) => {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(0)
  const { executeRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    onSuccess() {
      router.push('/orders')
    },
  })
  
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime()

      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const intervalId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout 
        token={(token) => executeRequest({ token, orderId: order.id })} 
        stripeKey="pk_test_51KYDkMDKUlTWtA700NBCUTA64Io7z3eIU8LgC7Vf0wYxsP0cGl2cxxxfPV5m90esbhruZXgNRvsAFQLteX3tSEQr00LkbU1fOZ"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context) => {
  const { api, currentUser, query: { orderId } } = context

  const { data: order } = await api.get(`/api/orders/${orderId}`)

  return {
    order,
    currentUser
  }
}

export default OrderShow