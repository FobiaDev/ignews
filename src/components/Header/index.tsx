import { ReactComponent as Logo } from "../../assets/svg/logo.svg";

import ActiveLink from "../ActiveLink";
import SignInButton from "../SignInButton";

import styles from "./styles.module.scss";

const Header = (): JSX.Element => {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Logo />
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};

export default Header;
