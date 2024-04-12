import Hero from "@/components/Hero/Hero";
import Highlights from "@/components/Highlights/Highlights";
import SendForm from "@/components/SendForm/SendForm";

export default function Home() {
  return (
    <div>
      <Hero />
      <Highlights />
      <SendForm />
    </div>
  );
}