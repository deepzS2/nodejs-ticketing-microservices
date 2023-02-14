import { AppContext, NextPage, NextPageContext } from 'next'
import { AxiosInstance } from 'axios'

declare module "next" {
  export type NextPage<P = {}, IP = P> = React.ComponentType<P> & {
    getInitialProps?(context: NextPageContextExtended): IP | Promise<IP>;
  }

  export type NextPageContextExtended = NextPageContext & {
    api: AxiosInstance
    currentUser: {
      id: string
    }
  }
}

declare module "next/app" {
  export type AppContextExtended = AppContext & {
    ctx: NextPageContextExtended
  }
}