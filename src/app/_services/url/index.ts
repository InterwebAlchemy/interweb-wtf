import Haikunator from 'haikunator';
import { ADJECTIVES, NOUNS } from '@/slugs';

const haikunator = new Haikunator({
  adjectives: ADJECTIVES,
  nouns: NOUNS,
  defaults: {
    delimiter: '-',
    tokenLength: 0,
  },
});

export function generateSlug(): string {
  return haikunator.haikunate();
}
