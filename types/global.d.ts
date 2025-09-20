// Ensure TypeScript understands .module.css files
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Ensure TypeScript understands .svg files with React components
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

// Add global type declarations
declare module 'next/link' {
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  import { AnchorHTMLAttributes } from 'react';
  
  export type LinkProps = Omit<NextLinkProps, 'passHref' | 'as'> & {
    children: React.ReactNode;
  } & AnchorHTMLAttributes<HTMLAnchorElement>;
  
  const Link: React.FC<LinkProps>;
  export default Link;
}

declare module 'next/head' {
  import { HeadProps } from 'next/head';
  
  const Head: React.FC<React.PropsWithChildren<HeadProps>>;
  export default Head;
}

// Add types for environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
