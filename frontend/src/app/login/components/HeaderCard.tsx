import Image from "next/image";
import React from "react";

function HeaderCard() {
  
  return (
    <div className="relative">
      {/* <div className="absolute top-0 left-0 bg-slate-50 rounded-xl shadow-sm p-4 flex items-center gap-6">
        <div className="flex gap-0.5">
          <div className="w-1.5 h-6 bg-primary/20 rounded" />
          <div className="w-1.5 h-6 bg-primary/40 rounded" />
          <div className="w-1.5 h-6 bg-primary rounded" />
        </div>
        <div>
          <div className="font-bold text-xl">100K+</div>
          <div className="text-gray-500 text-sm">People got hired</div>
        </div>
      </div> */}

      <div className="mt-20">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md relative mt-4">
          {/* <div className="absolute -right-4 -top-4 w-12 h-12 rounded-full border-4 border-white overflow-hidden"> */}
          <Image
            src="https://th.bing.com/th/id/OIP.XDma3yBdCqgo0_kt-w6OUAHaGz?rs=1&pid=ImgDetMain"
            alt="Profile"
            width={480}
            height={480}
            className="w-full h-full"
          />
          {/* </div> */}
          <div className="mb-2">
            <div className="font-medium">Adam Sandler</div>
            <div className="text-sm text-gray-500">Lead Engineer at Canva</div>
          </div>
          <p className="text-gray-700">
            &quot;Great platform for the job seeker that searching for new
            career heights.&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

export default HeaderCard;
