import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

// Типизация данных формы
interface RegisterForm {
    email: string;
    password: string;
    passwordRepeat: string;
    username: string;
}

function Register() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
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
            // Очистка формы и перенаправление после успешной регистрации
            setEmail('');
            setPassword('');
            setPasswordRepeat('');
            setUsername('');
            await router.push('/auth/login');
        } catch (err: unknown) {
            // Проверка на ошибку Axios и обработка
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Ошибка регистрации');
            } else {
                setError('Неизвестная ошибка');
            }
            console.error('Registration error:', err);
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
                <label>Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Repeat Password</label>
                <input
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
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
