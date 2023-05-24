import Cards from "./components/cards/cards";
import Links from "./components/links/links";

export default function Home() {
  return (
    <div>
      <div className="mt-2 ">
        <Links />
      </div>
      <Cards cities={[]} />
    </div>
  );
}
