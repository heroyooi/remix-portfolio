import { json } from '@remix-run/node';
import { increaseVisitorCount } from '~/lib/visitor.server';

export const action = async () => {
  await increaseVisitorCount();
  return json({ ok: true });
};
