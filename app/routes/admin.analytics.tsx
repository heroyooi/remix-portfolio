import { json, LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getVisitorCount } from '~/lib/visitor.server';
import { requireAdmin } from '~/lib/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireAdmin(request);
  const count = await getVisitorCount();
  return json({ count });
};

export default function AdminAnalyticsPage() {
  const { count } = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📊 방문자 수 통계</h1>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>
        👀 {count.toLocaleString()}명 방문
      </p>
    </div>
  );
}
