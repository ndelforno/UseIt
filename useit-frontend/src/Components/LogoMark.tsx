import logo from "../assets/useIt_Logo.png";

export const LogoMark: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={logo}
    alt="UseIt"
    className={className ?? "w-12 h-12"}
  />
);
