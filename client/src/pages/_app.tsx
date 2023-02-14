import 'bootstrap/dist/css/bootstrap.css'

import type { AppProps, AppContextExtended } from 'next/app'
import Header from '@/components/header'
import buildClient from '@/services/build-client'

type TProps = AppProps & {
  currentUser: any;
};

const MyApp = ({ Component, pageProps, currentUser }: TProps) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} />
      </div>
    </div>
  )
}

MyApp.getInitialProps = async ({ ctx, Component }: AppContextExtended) => {
  const api = buildClient(ctx)

  const { data } = await api.get('/api/users/currentuser')

  ctx['api'] = api
  ctx['currentUser'] = data.currentUser

  const pageProps = await Component.getInitialProps?.(ctx)

  return {
    pageProps,
    ...data
  }
}

export default MyApp