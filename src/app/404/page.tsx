import { notFound } from 'next/navigation';

export default async function ErrorPage() {
  return notFound();
}
