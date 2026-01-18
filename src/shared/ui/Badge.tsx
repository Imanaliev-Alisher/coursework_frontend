import type { ReactNode } from 'react';

export function Badge(props: { children: ReactNode; className?: string }) {
  return (
    <span
      className={
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ' +
        (props.className ?? '')
      }
    >
      {props.children}
    </span>
  );
}
