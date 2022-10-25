import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Login.module.css";
import { magic } from "../lib/magic-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    // go to / only when the didToken is back, not before
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");

    const email = e.target.value;
    setEmail(email);
  };

  const handleLoginWithEmail = async (e) => {
    console.log("hi button");
    e.preventDefault();

    if (email) {
      setIsLoading(true);
      // log in a user by their email
      try {
        const didToken = await magic.auth.loginWithMagicLink({
          email: email,
        });

        if (didToken) {
          // setIsLoading(false);
          console.log("didToken from Magic");
          console.log({ didToken });
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });
          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            console.log("cookie created");
            console.log({ loggedInResponse });
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch {
        // Handle errors if required!
        setIsLoading(false);
        console.error("Smth went wrong", error);
      }
      // route to dashboard
    } else {
      setIsLoading(false);
      // show user message
      setUserMsg("Enter a valid email address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <a>
              <div className={styles.logoWrapper}>
                <Image
                  src="/static/netflix.svg"
                  alt="Netflix logo"
                  width="128px"
                  height="34px"
                />
              </div>
            </a>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
