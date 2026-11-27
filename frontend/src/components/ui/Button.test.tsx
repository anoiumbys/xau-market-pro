import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('menampilkan teks dan memanggil onClick', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Simpan</Button>);

    fireEvent.click(screen.getByRole('button', { name: 'Simpan' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('nonaktif saat disabled', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Simpan
      </Button>
    );

    const btn = screen.getByRole('button', { name: 'Simpan' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('nonaktif dan menampilkan spinner saat loading', () => {
    const { container } = render(<Button loading>Kirim</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
    expect(container.querySelector('svg.animate-spin')).not.toBeNull();
  });

  it('menerapkan class varian dan ukuran', () => {
    render(
      <Button variant="danger" size="lg">
        Hapus
      </Button>
    );

    const btn = screen.getByRole('button', { name: 'Hapus' });
    expect(btn.className).toContain('bg-red-600');
    expect(btn.className).toContain('px-6');
  });
});
