export default function BellIcon({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#3C507D] dark:text-white ${className}`}
    >
      <path
        d="M2.53001 14.77C2.31701 16.164 3.26801 17.131 4.43201 17.613C8.89501 19.463 15.105 19.463 19.568 17.613C20.732 17.131 21.683 16.163 21.47 14.77C21.34 13.913 20.693 13.2 20.214 12.503C19.587 11.579 19.525 10.572 19.524 9.5C19.525 5.358 16.157 2 12 2C7.843 2 4.47501 5.358 4.47501 9.5C4.47501 10.572 4.41301 11.58 3.78501 12.503C3.30701 13.2 2.66101 13.913 2.53001 14.77Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 19C8.458 20.725 10.076 22 12 22C13.925 22 15.541 20.725 16 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}