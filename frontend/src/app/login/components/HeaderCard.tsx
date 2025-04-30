"use client"

import Image from "next/image"
import { motion } from "framer-motion"

function HeaderCard() {
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 max-w-md relative mt-4 border border-neutral-200 dark:border-neutral-800"
      >
        <div className="relative w-full h-64 mb-6 overflow-hidden rounded-xl">
          <Image
            src="https://th.bing.com/th/id/OIP.XDma3yBdCqgo0_kt-w6OUAHaGz?rs=1&pid=ImgDetMain"
            alt="Profile"
            width={480}
            height={480}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="mb-4">
          <div className="font-medium text-xl">Adam Sandler</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Lead Engineer at Canva</div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg italic">
          &quot;Great platform for the job seeker that searching for new career heights.&quot;
        </p>
      </motion.div>
    </div>
  )
}

export default HeaderCard
