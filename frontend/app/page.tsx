"use client";
import Image from "next/image";
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      
      {/* Main content container */}
      <div className="container mx-auto px-4 md:mt-[200px] mt-[200px] lg:mt-32 ">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16">
          
          {/* Text content */}
          <div className="text-center md:text-left">
            <h1 className="text-[#f7f2e7] text-3xl sm:text-4xl lg:text-5xl font-bold">
              Your Ticket, Your Fate
            </h1>
            <h2 className="text-[#3898FF] text-3xl sm:text-4xl lg:text-6xl font-bold mt-2">
              Your Blockchain
            </h2>
            <button  className="text-white font-semibold py-[5px] bg-[#3898FF] ml-[20px] mt-[30px] p-[7px] rounded-lg lg:hidden">
              <Link href={'/participate'}>Participate</Link></button>
          </div>
          
          {/* Ethereum logo with reflection */}
          <div className="relative flex flex-col items-center mt-8 md:mt-0">
            {/* Main image */}
            <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] lg:w-[180px] lg:h-[180px]">
              <Image
                src="/etherium.png"
                alt="Ethereum Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Reflection */}
            <div className="relative w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] lg:w-[180px] lg:h-[180px] mt-[-10px]">
              <Image
                src="/etherium.png"
                alt="Ethereum Reflection"
                fill
                className="object-contain rotate-180 scale-y-[-1] blur-sm"
                style={{
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0))",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0))"
                }}
                priority
              />
            </div>
          </div>
          
        </div>
        <section id="about" className="mt-[100px]">
          <div className="text-[#3898FF] font-rajdhani font-bold text-3xl w-full text-center">
            About
          </div>
          <div className="flex mt-[50px]">
             <img className="lg:h-[500px] md:h-[300px] sm:h-[200px] sm:inline-block hidden" src="about.png" alt="" />
             <div className="text-[#f7f2e7] text-center sm:text-sm md:text-lg  md:mt-[80px] lg:mt-[150px]  text-xs mx-[40px]">Welcome to <span className="text-[#3898FF] "><Link href={"/"}>EtherDraw</Link></span>, a decentralized raffle platform where users can participate with a minimum entry fee of 0.01 ETH. Powered by Ethereum smart contracts, our raffle system ensures full transparency and fairness. We utilize Chainlink Automation to automatically trigger the raffle every 30 seconds, providing seamless and timely results. Additionally, the Chainlink VRF (Verifiable Random Function) guarantees true randomness in winner selection, making the process tamper-proof and fair. Embracing decentralization, we eliminate the need for intermediaries, giving users complete control and trust in every draw.</div>

            
              
          </div>
        </section>
      </div>
    </main>
  );
}
