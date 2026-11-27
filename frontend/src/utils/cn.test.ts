import { describe, it, expect } from 'vitest';
import {
  cn,
  formatPrice,
  formatPnL,
  formatPnLPercent,
  getDirectionColor,
  getPnLColor,
  getStatusColor,
} from './cn';

describe('cn', () => {
  it('menggabungkan class dan mengabaikan nilai falsy', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });

  it('mendukung class bersyarat berbentuk objek', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active');
  });
});

describe('formatPrice', () => {
  it('memakai 2 desimal dan pemisah ribuan secara default', () => {
    expect(formatPrice(2350)).toBe('2,350.00');
  });

  it('menghormati jumlah desimal yang diminta', () => {
    expect(formatPrice(1.5, 3)).toBe('1.500');
  });
});

describe('formatPnL', () => {
  it('menampilkan tanda + untuk profit', () => {
    expect(formatPnL(12.5)).toBe('+12.50');
  });

  it('menampilkan tanda - untuk loss', () => {
    expect(formatPnL(-3)).toBe('-3.00');
  });

  it('menampilkan "-" bila PnL belum ada (null)', () => {
    expect(formatPnL(null)).toBe('-');
  });
});

describe('formatPnLPercent', () => {
  it('menghitung persen PnL terhadap harga masuk', () => {
    expect(formatPnLPercent(10, 2000)).toBe('+0.50%');
  });

  it('aman bila harga masuk kosong atau nol', () => {
    expect(formatPnLPercent(10, null)).toBe('-');
    expect(formatPnLPercent(10, 0)).toBe('-');
  });
});

describe('helper warna', () => {
  it('long hijau, short merah', () => {
    expect(getDirectionColor('long')).toBe('text-green-400');
    expect(getDirectionColor('short')).toBe('text-red-400');
  });

  it('warna PnL mengikuti tanda nilainya', () => {
    expect(getPnLColor(5)).toBe('text-green-400');
    expect(getPnLColor(-5)).toBe('text-red-400');
    expect(getPnLColor(0)).toBe('text-dark-400');
    expect(getPnLColor(null)).toBe('text-dark-400');
  });

  it('warna status trade', () => {
    expect(getStatusColor('open')).toBe('text-blue-400');
    expect(getStatusColor('closed')).toBe('text-green-400');
    expect(getStatusColor('cancelled')).toBe('text-gray-400');
  });
});
