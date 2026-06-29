// app/dashboard/add-lesson/page.jsx

import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import AddLessonClient from "./AddLessonClient";

export default async function MyLessonPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return <AddLessonClient user={session.user} />;
}