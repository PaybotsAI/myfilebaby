import {isMobile} from 'react-device-detect';
import { useState, useEffect } from 'react';

export default function useMobileSize() {
  const isBrowser = () => typeof window !== "undefined"
  const [windowSize, setWindowSize] = useState({
    width: isBrowser() ? window.innerWidth : null,
    height: isBrowser() ? window.innerHeight : null,
  });
  const updateSize = () => {
  try{
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  } catch(e){
    console.log(e)
  }
  };
  // using a timeout per bug described at
  // https://github.com/juggle/resize-observer/issues/103
  const resizeHandler = () => {
    setTimeout(updateSize, 1);
  };
  useEffect(() => {
    if(isBrowser()) {
      window.addEventListener('resize', resizeHandler);
    }
    return () => window.removeEventListener('resize', resizeHandler);
  })
  
  return isMobile || windowSize?.width < 400
}