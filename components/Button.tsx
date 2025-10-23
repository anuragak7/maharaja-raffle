import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-white bg-gradient-to-r from-blue-500 via-pink-400 to-blue-600 hover:from-blue-600 hover:to-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95',
        className
      )}
      {...props}
    />
  );
}