import DiagramPageClient from '@/components/edit/diagram_page';

export default async function DiagramPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  return (
    <DiagramPageClient id={id} />
  )
}