import { NoteEditor } from '@/components/NoteEditor';

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <NoteEditor noteId={resolvedParams.id} />;
}
