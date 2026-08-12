export default function Arrow({ size = 13 }) {
  return (
    <svg
      className="btn__arrow"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 7h11.5M8 2.5 12.5 7 8 11.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  )
}
