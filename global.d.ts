// global.d.ts
interface Window {
  netlifyIdentity?: {
    on: (event: string, callback: (user?: any) => void) => void;
  };
}
