import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ManageLessons from "./ManageLessons";

export default async function ManageTicketsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return <ManageLessons user={session.user} />;
}