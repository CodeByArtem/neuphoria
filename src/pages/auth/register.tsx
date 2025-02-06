import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/router';

interface RegisterResponse {
    message: string;
}

interface RegisterError {
    message: string;
}

function Register() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordRepeat, setPasswordRepeat] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        // Проверка на совпадение паролей
        if (password !== passwordRepeat) {
            setError('Пароли не совпадают');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await axios.post<RegisterResponse>('https://nestbackgame.onrender.com/api/auth/register', {
                email,
                password,
                username, // Убираем passwordRepeat, если он не нужен серверу
            });

            console.log('Registration success:', response.data);
            // После успешной регистрации можно очистить форму или перенаправить
            setEmail('');
            setPassword('');
            setPasswordRepeat('');
            setUsername('');
            // Перенаправление или другая логика после успешной регистрации
            await router.push('/auth/login');
        } catch (err) {
            const axiosError = err as AxiosError<RegisterError>;
            console.error('Registration error:', axiosError?.response?.data);
            const errorMessage = axiosError?.response?.data?.message || 'Ошибка регистрации';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => handleChange(e, setEmail)}
                    required
                />
            </div>

            <div>
                <label>Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => handleChange(e, setPassword)}
                    minLength={6}
                    required
                />
            </div>

            <div>
                <label>Повторите пароль</label>
                <input
                    type="password"
                    value={passwordRepeat}
                    onChange={(e) => handleChange(e, setPasswordRepeat)}
                    minLength={6}
                    required
                />
            </div>

            <div>
                <label>Имя пользователя</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => handleChange(e, setUsername)}
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
