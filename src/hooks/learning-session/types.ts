
export type AccessStatus = 
  | 'loading' 
  | 'allowed' 
  | 'denied_category' 
  | 'denied_pro' 
  | 'denied_auth'  // Added this to make both AccessStatus types compatible
  | 'no_selection'
  | 'pending' 
  | 'not_found';
