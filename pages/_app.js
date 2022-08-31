import '../assets/styles/global.sass'
import Page from './index'

function MyApp({ Component, pageProps }) {
  return (
    <Page>
        <Component {...pageProps} />
    </Page>
  )
}

export default MyApp
