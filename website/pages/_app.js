import App from "next/app"
import Router from "next/router"
import * as gtag from "../lib/gtag"

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url))

import '../styles/main.css';
import "@dracula/dracula-ui/styles/dracula-ui.css"

const Noop = ({ children }) => children

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Component {...pageProps} />
    )
  }
}
