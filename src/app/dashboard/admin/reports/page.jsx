import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import ClientReport from "./ClientReport";

export default async function AdvertisePage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return <ClientReport user={session.user} />;
}