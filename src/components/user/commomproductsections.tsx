export default function commomproductsections() {
    return (<>
      
      <section className="w-full py-2 bg-black text-white ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-16">
          <div className="flex-1 flex flex-col items-center md:items-start">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
              Take Control
              <br />
              Wherever You Are
            </h2>
            <p className="mb-8 text-lg md:text-xl max-w-md">
              With the Smart Life App you can preheat your sauna, set custom
              temperatures, and schedule sessions anytime, form anywhere.
            </p>
            <div className="flex gap-4">
              <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="/assets/download/apple_download.png" alt="Download on the App Store" className="h-14 w-auto  hover:shadow-lg transition" style={{ minWidth: 160 }}/>
              </a>
              <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="inline-block">
                <img src="/assets/download/android_download.png" alt="Get it on Google Play" className="h-14 w-auto  hover:shadow-lg transition" style={{ minWidth: 160 }}/>
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/assets/download/app.png" alt="Smart Life App on Phone" className="max-h-full w-auto drop-shadow-2xl"/>
          </div>
        </div>
      </section>
      
      <section className="w-full relative h-[520px] md:h-[580px] flex items-center justify-center overflow-hidden my-0" style={{ background: "#000" }}>
        <img src="/assets/saunas/product/bg-1.png" alt="Sauna background" className="absolute inset-0 w-full h-full object-cover object-center z-0" style={{ filter: "brightness(0.7)" }}/>
        <div className="relative z-10 flex flex-col items-start md:items-end w-full max-w-7xl px-6 mx-auto">
          <div className="mt-12 md:mt-0 md:mr-24">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Still Deciding?
              <br />
              We're Here for You
            </h2>
            <button className="bg-white text-black font-semibold rounded-lg px-6 py-3 shadow hover:bg-gray-100 transition text-lg" style={{ minWidth: 200 }} onClick={() => window.open("mailto:support@example.com", "_blank")}>
              Speak with our Team
            </button>
          </div>
        </div>
      </section>
      
      <section className="w-full h-[420px] md:h-[520px] flex flex-col md:flex-row items-stretch justify-stretch bg-black overflow-hidden">
        
        <div className="w-full md:w-1/2 h-[220px] md:h-auto relative">
          <img src="/assets/saunas/product/bg-2.png" alt="Contrast Therapy Cold Plunge" className="absolute inset-0 w-full h-full object-cover object-center" style={{ minHeight: 220 }}/>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start px-6 md:px-16 py-10 md:py-0 bg-black">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Contrast Therapy
          </h2>
          <p className="text-white text-md md:text-md mb-6 max-w-xl">
            Accompany your cold plunge with a sauna to enhance your experience
            with the benefits of contrast therapy.
          </p>
          <button className="bg-white text-black font-semibold rounded-lg px-6 py-3 shadow hover:bg-gray-100 transition text-md" style={{ minWidth: 160 }} onClick={() => (window.location.href = "/sauna")}>
            Shop Saunas
          </button>
        </div>
      </section>
    </>);
}
