import { redirect } from "next/navigation";

/** bazziba.it-style /author/{slug} URLs → canonical /u/{slug} profile. */
export default async function AuthorAliasPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  redirect(`/u/${username}`);
}
