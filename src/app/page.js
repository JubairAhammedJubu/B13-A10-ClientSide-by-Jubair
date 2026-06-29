import AdvertiseSection from "@/components/AdvertiseSection";
import FeaturedLessons from "@/components/Featuredlessons";
import HeroSlider from "@/components/HeroSlider";
import MostSavedLessons from "@/components/MostSavedLessons";
import Topcontributors from "@/components/Topcontributors";
import WhyChooseUs from "@/components/WhyChooseUs";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="">
      <HeroSlider />
      <FeaturedLessons user={session?.user ?? null} />
      <div className="bg-gray-50 dark:bg-gray-950">
        <Topcontributors />
      </div>
      <MostSavedLessons user={session?.user ?? null} />
      <div className="bg-gray-50 dark:bg-gray-950">
        <WhyChooseUs />
      </div>
      <AdvertiseSection />
    </div>
  );
}
