
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { isValidRoute } from '@/constants/routes';

interface SafeLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  fallback?: string;
  onInvalidRoute?: (invalidRoute: string) => void;
}

export default function SafeLink({ 
  to, 
  fallback = '/', 
  onInvalidRoute,
  children, 
  ...props 
}: SafeLinkProps) {
  // Validate the route before rendering
  const targetRoute = isValidRoute(to) ? to : fallback;
  
  // Log invalid routes in development
  if (!isValidRoute(to)) {
    console.warn(`SafeLink: Invalid route "${to}" detected, falling back to "${fallback}"`);
    onInvalidRoute?.(to);
  }
  
  return (
    <Link to={targetRoute} {...props}>
      {children}
    </Link>
  );
}
