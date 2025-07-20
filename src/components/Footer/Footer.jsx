import React from 'react'
import './Footer.css'
import { icons } from '../../assets/icons/icons'

const Footer = () => {
  return (
   <footer className='footer'>
    Propulsé par<img src={icons.scanme_logo} alt="scanme_logo" />
   </footer>
  )
}

export default Footer