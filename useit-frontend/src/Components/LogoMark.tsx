import logo from "../assets/useIt_Logo.png";

export const LogoMark: React.FC<{ className?: string }> = ({ className }) => (
  <img
    src={logo}
    alt=""
    className="w-12 h-12"
    style={{ position: "absolute", top: "8px", left: "8px" }}
  />
);
