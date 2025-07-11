import React, {useEffect} from 'react'
import Checkout from '../../components/Checkout/Checkout'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
const CheckoutPage = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
       <Navbar />
       <Checkout />
       <Footer />
    </>
  )
}

export default CheckoutPage