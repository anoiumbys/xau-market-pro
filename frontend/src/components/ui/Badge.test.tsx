import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Badge,
  StatusBadge,
  DirectionBadge,
  PlanBadge,
  SubscriptionStatusBadge,
  UserRoleBadge,
} from './Badge';

describe('Badge', () => {
  it('menampilkan isi dan class varian', () => {
    render(<Badge variant="success">Aktif</Badge>);
    expect(screen.getByText('Aktif').className).toContain('text-green-700');
  });
});

describe('badge khusus', () => {
  it('StatusBadge menampilkan label status trade', () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });

  it('DirectionBadge membedakan long dan short', () => {
    const { rerender } = render(<DirectionBadge direction="long" />);
    expect(screen.getByText('Long')).toBeInTheDocument();

    rerender(<DirectionBadge direction="short" />);
    expect(screen.getByText('Short')).toBeInTheDocument();
  });

  it('PlanBadge menampilkan nama paket', () => {
    render(<PlanBadge plan="enterprise" />);
    expect(screen.getByText('Enterprise')).toBeInTheDocument();
  });

  it('SubscriptionStatusBadge menampilkan status langganan', () => {
    render(<SubscriptionStatusBadge status="pending" />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('UserRoleBadge menampilkan role pengguna', () => {
    render(<UserRoleBadge role="admin" />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});
