import { describe, it, expect } from 'vitest';
import en from './en.json';
import es from './es.json';
import id from './id.json';

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object'
      ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
      : [`${prefix}${key}`]
  );
}

describe('kelengkapan terjemahan (i18n)', () => {
  const enKeys = flatten(en).sort();

  it('Bahasa Indonesia punya kunci yang sama dengan Inggris', () => {
    expect(flatten(id).sort()).toEqual(enKeys);
  });

  it('Bahasa Spanyol punya kunci yang sama dengan Inggris', () => {
    expect(flatten(es).sort()).toEqual(enKeys);
  });

  it('tidak ada terjemahan yang kosong', () => {
    const empty = [en, es, id].flatMap((dict) =>
      flatten(dict).filter((key) => {
        const value = key
          .split('.')
          .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], dict);
        return typeof value === 'string' && value.trim() === '';
      })
    );
    expect(empty).toEqual([]);
  });
});
