// app/dashboard/user/favorites/page.jsx
import {headers} from "next/headers";
import {auth} from "@/lib/auth";
import FavoritesClient from "./Favoritesclient";

export default async function FavoritesPage() {
  const session = await auth.api.getSession({headers: await headers()});
  return <FavoritesClient user={session?.user} />;
}
