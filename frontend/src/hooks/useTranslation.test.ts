import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTranslation } from './useTranslation';
import { useLocaleStore } from '@stores/localeStore';

describe('useTranslation', () => {
  beforeEach(() => {
    act(() => useLocaleStore.getState().setLocale('en'));
  });

  it('menerjemahkan kunci bersarang sesuai bahasa aktif', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('common.save')).toBe('Save');
  });

  it('berpindah ke Bahasa Indonesia saat locale diganti', () => {
    const { result } = renderHook(() => useTranslation());

    act(() => useLocaleStore.getState().setLocale('id'));

    expect(result.current.locale).toBe('id');
    expect(result.current.t('common.save')).toBe('Simpan');
    expect(result.current.t('navigation.dashboard')).toBe('Dasbor');
  });

  it('mengembalikan kunci itu sendiri bila terjemahan tidak ada', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('kunci.tidak.ada')).toBe('kunci.tidak.ada');
  });

  it('mengembalikan kunci bila yang ditunjuk bukan string (grup)', () => {
    const { result } = renderHook(() => useTranslation());
    expect(result.current.t('common')).toBe('common');
  });
});
