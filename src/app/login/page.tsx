'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginAccount, savePlayerProfile } from '@/lib/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    try {
      const account = loginAccount(email, password);
      savePlayerProfile({
        id: account.id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        status: account.status,
      });
      router.push('/');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Не удалось войти.');
    }
  };

  return (
    <main className="shell">
      <div className="page max-w-2xl">
        <div className="glass-panel hero-card">
          <div className="badge">Вход</div>
          <h1 className="brand-title mt-4 text-5xl font-bold">Войти в аккаунт</h1>
          <p className="mt-4 text-[var(--muted)]">Используй email и пароль, которые указала при регистрации.</p>

          <div className="mt-8 space-y-4">
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
            {error && <div className="rounded-[20px] bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}
            <button onClick={handleSubmit} className="primary-btn w-full rounded-[24px] px-6 py-4 font-extrabold">
              Войти
            </button>
            <Link href="/register" className="ghost-btn block rounded-[24px] px-6 py-4 text-center font-bold">
              Нет аккаунта? Регистрация
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
