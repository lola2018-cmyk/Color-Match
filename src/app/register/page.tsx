'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CAT_AVATARS } from '@/lib/game-content';
import { registerAccount, savePlayerProfile } from '@/lib/storage';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(CAT_AVATARS[0]!);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!password || password.length < 4) {
      setError('Пароль должен быть не короче 4 символов.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароль и подтверждение не совпадают.');
      return;
    }

    const account = {
      id: `player-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Pink Player',
      email: email.trim().toLowerCase() || 'player@color.match',
      password,
      avatar,
      status: '',
    };

    try {
      registerAccount(account);
      savePlayerProfile({
        id: account.id,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        status: account.status,
      });
      router.push('/');
    } catch (registrationError) {
      setError(registrationError instanceof Error ? registrationError.message : 'Не удалось создать аккаунт.');
    }
  };

  return (
    <main className="shell">
      <div className="page max-w-2xl">
        <div className="glass-panel hero-card">
          <div className="badge">Создание аккаунта</div>
          <h1 className="brand-title mt-4 text-5xl font-bold">Регистрация</h1>
          <p className="mt-4 text-[var(--muted)]">Создай локальную учётную запись, выбери кото-аватар и зайди в игру.</p>

          <div className="mt-8 space-y-4">
            <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
            <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
            />
            <input
              className="field"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Подтверждение пароля"
            />

            <div className="rounded-[24px] bg-white/65 p-4">
              <div className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--muted)]">Аватар-котик</div>
              <div className="mt-3 flex flex-wrap gap-3">
                {CAT_AVATARS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`secondary-btn rounded-2xl px-4 py-3 text-3xl ${avatar === item ? 'ring-2 ring-pink-400' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="rounded-[20px] bg-rose-100 p-4 text-sm text-rose-700">{error}</div>}

            <button onClick={handleSubmit} className="primary-btn w-full rounded-[24px] px-6 py-4 font-extrabold">
              Создать профиль
            </button>
            <Link href="/login" className="ghost-btn block rounded-[24px] px-6 py-4 text-center font-bold">
              Уже есть профиль? Войти
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
