import { NoteEditor } from '@/components/NoteEditor';
import { NoteType } from '@/lib/store';

export default async function AddNotePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const type = (resolvedParams.type as NoteType) || 'text';
  return <NoteEditor initialType={type} />;
}
