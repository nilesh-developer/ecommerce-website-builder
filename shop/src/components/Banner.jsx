import React, { useState } from 'react';

function Banner({ store, color1, color2 }) {
  const [desktopImageLoaded, setDesktopImageLoaded] = useState(false);
  const [mobileImageLoaded, setMobileImageLoaded] = useState(false);

  if (!store) {
    return (
      <>
        <div data-theme="light" className="hidden md:flex">
          <div className="flex justify-center skeleton rounded-none items-center text-4xl w-full h-96 font-bold">
          </div>
        </div>
        <div data-theme="light" className="md:hidden flex">
          <div className="flex justify-center skeleton rounded-none items-center text-4xl w-full h-96 font-bold">
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Banner */}
      <div className="hidden md:flex">
        {store.banner ? (
          <>
            {!desktopImageLoaded && (
              <div
                data-theme="light"
                className="flex justify-center skeleton rounded-none items-center text-4xl w-full h-96 font-bold"
              >
              </div>
            )}
            <div
              className={`flex justify-center items-center text-4xl w-full h-auto text-white font-bold ${!desktopImageLoaded ? 'hidden' : ''}`}
              style={{ color: color2, backgroundColor: color1 }}
            >
              <img
                className="h-full w-full"
                src={store.banner}
                alt="store banner"
                onLoad={() => setDesktopImageLoaded(true)}
              />
            </div>
          </>
        ) : (
          <div
            className="flex justify-center items-center text-4xl w-full h-96 text-white font-bold"
            style={{ color: color2, backgroundColor: color1 }}
          >
            Sample Banner Text
          </div>
        )}
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden flex">
        {store.mobileBanner ? (
          <>
            {!mobileImageLoaded && (
              <div
                data-theme="light"
                className="flex skeleton justify-center rounded-none items-center w-full h-96 text-white font-bold"
              >
              </div>
            )}
            <div
              className={`flex justify-center items-center text-4xl w-full h-auto text-white font-bold ${!mobileImageLoaded ? 'hidden' : ''}`}
              style={{ color: color2, backgroundColor: color1 }}
            >
              <img
                className="h-full w-full"
                src={store.mobileBanner}
                alt="store banner"
                onLoad={() => setMobileImageLoaded(true)}
              />
            </div>
          </>
        ) : (
          <div
            className="flex justify-center items-center text-4xl w-full h-96 text-white font-bold"
            style={{ color: color2, backgroundColor: color1 }}
          >
            Sample Banner Text
          </div>
        )}
      </div>
    </>
  );
}

export default Banner;
