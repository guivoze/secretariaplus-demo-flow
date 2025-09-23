/// <reference types="vite/client" />

// Allow custom VTurb web component in JSX
declare namespace JSX {
  interface IntrinsicElements {
    'vturb-smartplayer': any;
  }
}
