import React from 'react'

function Logo(){
  return (
    <div className="flex justify-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black font-mono tracking-tight select-none">
            <span className="text-base-content/60">&lt;</span>

            <span
                className="
                  bg-gradient-to-r
                  from-sky-500
                  via-blue-600
                  to-violet-600
                  bg-clip-text
                  text-transparent
                  drop-shadow-[0_0_10px_rgba(59,130,246,0.35)]
                "
              >
                CODIFY
              </span>

              <span className="text-base-content/60">/&gt;</span>
            </h1>
          </div>
  )
}

export default Logo
