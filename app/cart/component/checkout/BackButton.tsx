'use client';

interface BackButtonProps {
  onClick: () => void;
  label: string;
}

export const BackButton = ({ onClick, label }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors duration-200 mb-4 group"
    >
      <svg
        className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </button>
  );
};
