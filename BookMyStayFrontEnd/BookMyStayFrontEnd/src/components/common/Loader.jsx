import { Loader2 } from 'lucide-react'
import React from 'react'
import loader2 from '../../assets/Loding2.gif'

const Loader = ({className=""}) => {
  return (
   <div className="flex justify-center items-center h-screen bg-white">
      <img
        src={loader2}
        alt="Loading..."
        className="w-[300px] h-[300px]  rounded-xl"
      />
    </div>
  )
}

export default Loader
