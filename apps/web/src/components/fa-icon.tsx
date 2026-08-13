type FaIconProps = {
  icon: string;
  className?: string;
};

export function FaIcon({ icon, className = "" }: FaIconProps) {
  return (
    <i className={`fa-solid ${icon} ${className}`.trim()} aria-hidden="true" />
  );
}
