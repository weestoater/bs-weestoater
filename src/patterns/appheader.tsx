import { HashLink } from "react-router-hash-link";
import wsIcon from "../assets/img/weestoater-icon.png";

export const Header = () => {
  const items = [
    "Home",
    "About",
    "A11y",
    "Agile",
    "Football",
    "Landie",
    "React",
  ];

  return (
    <header>
      <HashLink
        smooth
        to="#main-content"
        className="skip-link"
        data-testid="main-content-skip-link"
      >
        Skip to main content
      </HashLink>
      <img src={wsIcon} alt="weestoater icon" />
      <ul>
        {items.map((item, key) => (
          <li key={key}>
            <a href={`./#/${item.toLowerCase()}`}>{item}</a>
          </li>
        ))}
      </ul>
    </header>
  );
};
