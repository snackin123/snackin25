// types/next-navigation.d.ts

declare module 'next/navigation' {
  export function useRouter(): {
    push(href: string, options?: { scroll?: boolean }): void;
    replace(href: string, options?: { scroll?: boolean }): void;
    back(): void;
    forward(): void;
    refresh(): void;
    prefetch(href: string): void;
  };

  export function usePathname(): string;
  export function useSearchParams(): URLSearchParams;
  export function useSelectedLayoutSegment(parallelRoutesKey?: string): string | null;
  export function useSelectedLayoutSegments(parallelRoutesKey?: string): string[];
  export function useParams(): Record<string, string | string[]>;
  export function useSearchParam(key: string): string | null;
  export function useSearchParams(keys?: string[]): Record<string, string | null>;
  export function useServerInsertedHTML(
    callback: () => React.ReactNode
  ): void;
  export function useServerInsertedHTMLEffect(
    callback: () => React.ReactNode
  ): void;
  export function useServerInsertedHTMLEffect(
    callback: () => React.ReactNode,
    deps: React.DependencyList
  ): void;
  export function useServerInsertedHTMLEffect(
    callback: () => React.ReactNode,
    deps: React.DependencyList | undefined,
    condition?: boolean
  ): void;
}
