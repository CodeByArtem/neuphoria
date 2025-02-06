import { useState } from 'react';
import axios, { AxiosError } from 'axios';  // Импортируем AxiosError
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
            setEmail('');
            setPassword('');
            setPasswordRepeat('');
            setUsername('');
            await router.push('/auth/login');
        } catch (err: unknown) {  // Используем unknown для более строгой типизации
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError;  // Приводим ошибку к типу AxiosError
                // @ts-ignore
                setError(axiosError?.response?.data?.message || 'Ошибка регистрации');
            } else {
                setError('Ошибка регистрации');
            }
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
