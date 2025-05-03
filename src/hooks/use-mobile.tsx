
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Add event listener for resize events
    window.addEventListener('resize', checkMobile);
    
    // Add event listener for media query changes
    mql.addEventListener("change", checkMobile);
    
    // Set initial value
    checkMobile();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
      mql.removeEventListener("change", checkMobile);
    }
  }, [])

  // Return false during SSR, true when mobile, false when desktop
  return isMobile === undefined ? false : !!isMobile
}
