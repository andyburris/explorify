import { cookies } from "next/headers"
import { LandingPage } from './landing/Landing';
import { HomePageLayout } from "./home/HomePageLayout";
import { HAS_LISTENS_NAME } from "./data/persist/Database";

export default function MainPage() {
  const hasEntries = cookies().has(HAS_LISTENS_NAME) && cookies().get(HAS_LISTENS_NAME)?.value == "1"
  console.log(`hasEntries = ${hasEntries}, allCookies = ${cookies().getAll()}`)

  return (hasEntries)
    ? <HomePageLayout/>
    : <LandingPage/>
}
