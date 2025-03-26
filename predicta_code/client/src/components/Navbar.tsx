'use client';

import { usePrivy } from '@privy-io/react-auth';
import LoggedInNavbar from './LoggedInNavbar';
import LoggedOutNavbar from './LoggedOutNavbar';

export default function Navbar() {
  const { authenticated, ready } = usePrivy();
  
  // Wait for Privy to initialize
  if (!ready) {
    return null;
  }

  return authenticated ? <LoggedInNavbar /> : <LoggedOutNavbar />;
}