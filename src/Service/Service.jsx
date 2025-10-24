import React from 'react'
import CommonSec from '../navbar/CommonSec'
import { RxSlash } from 'react-icons/rx'
import Pagetitle from '../patients/Pagetitle'
import Modalnavigationbar from '../navbar/Modalnavigationbar'
import ServiceContent from './ServiceContent'

function Service() {
  return (
    <>
      <CommonSec />
      <Modalnavigationbar />

      <div className="page-title-area">
        <Pagetitle
          heading="OUR SERVICES"
          pagetitlelink="/"
          title1="Home"
          title2="Services"
          IconComponent={RxSlash}
        />
      </div>
      <ServiceContent />
    </>

  )
}

export default Service
