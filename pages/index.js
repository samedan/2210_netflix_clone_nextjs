import Head from "next/head";
import styles from "../styles/Home.module.css";

import Banner from "../components/banner/banner";
import NavBar from "../components/nav/navbar";
import SectionCards from "../components/card/section-cards";
import { getVideos } from "../lib/videos";

export default function Home({
  disneyVideos,
  productivityVideos,
  travelVideos,
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar username="ankita@ank.com" />
      <Banner
        title="Clifford the red dog"
        subTitle="a very cute dog"
        imgUrl="/static/clifford.webp"
      />

      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards title="Travel" videos={travelVideos} size="small" />
        <SectionCards
          title="Productivity"
          videos={productivityVideos}
          size="medium"
        />
        <SectionCards title="Popular" videos={disneyVideos} size="small" />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  return { props: { disneyVideos, productivityVideos, travelVideos } };
}
