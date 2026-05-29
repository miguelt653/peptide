import Nav from "./components/Nav";
import Hero from "./components/Hero";
import StatsBar from "./components/StatsBar";
import Integration from "./components/Integration";
import Products from "./components/Products";
import WhoWeServe from "./components/WhoWeServe";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <Integration />
        <Products />
        <WhoWeServe />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
