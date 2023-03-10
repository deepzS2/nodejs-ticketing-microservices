import axios from 'axios'
import { NextPageContext } from 'next'

export default function buildClient(context: NextPageContext) {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: context.req?.headers
    })
  } else {
    return axios.create({
      baseURL: '/',
    })
  }
}