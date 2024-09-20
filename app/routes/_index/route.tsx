import type { MetaFunction } from "@remix-run/node";
import WMMCanvas from "~/components/wmm";

export const meta: MetaFunction = () => {
  return [
    { title: "Vamsi Kalagaturu" },
    { name: "Just a random guy", content: "Yello!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <WMMCanvas />
    </div>
  );
}
