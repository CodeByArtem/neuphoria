import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // Проверка на совпадение паролей
        if (password !== passwordRepeat) {
            setError('Пароли не совпадают');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.post('https://nestbackgame.onrender.com/api/auth/register', {
                email,
                password,
                passwordRepeat,
                username,
            });

            console.log('Registration success:', response.data);
            // После успешной регистрации можно очистить форму или перенаправить
            setEmail('');
            setPassword('');
            setPasswordRepeat('');
            setUsername('');
            // Перенаправление или другая логика после успешной регистрации
            await router.push('/auth/login');
        } catch (err: any) {
            console.error('Registration error:', err?.response?.data);
            setError(err?.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                />
            </div>

            <div>
                <label>Повторите пароль</label>
                <input
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    minLength={6}
                    required
                />
            </div>

            <div>
                <label>Имя пользователя</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
        </form>
    );
}

export default Register;
