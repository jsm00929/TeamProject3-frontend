'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { api } from '@/utils/api/customAxios';
import { GoogleLoginBtn, GoogleSignUpBtn } from '@/components/auth/GoogleBtn';
interface FormValue {
  email: string;
  password: string;
}

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>();

  const router = useRouter();

  const onSubmitHandler: SubmitHandler<FormValue> = async (data) => {
    const result = await api.post('/api/auth/login', data);

    if (result?.status === 200) {
      router.replace('/');
      router.refresh();
    }
  };

  return (
    <div className="flex">
      <div className="px-14 py-10 mx-auto my-[128px] border-solid border border-gray-800/10 rounded-2xl shadow-2xl bg-white">
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              아이디
            </label>
            <input
              {...register('email', {
                required: true,
              })}
              type="text"
              id="email"
              className="input input-bordered w-full"
              placeholder="test@test.com"
            />
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              <span className="font-bold">
                {errors.email?.type === 'required' && '이메일을 입력해주세요!'}
              </span>
            </p>
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              비밀번호
            </label>
            <input
              {...register('password', {
                required: true,
              })}
              type="password"
              id="password"
              className="input input-bordered w-full"
            />
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              <span className="font-bold">
                {errors.password?.type === 'required' &&
                  '비밀번호를 입력해주세요!'}
              </span>
            </p>
          </div>
          <div className="flex flex-col justify-between">
            {/* <button type="submit" className="btn btn-primary w-full">
              로그인
            </button> */}
            <button type="submit" className="btn btn-primary w-full">
              로그인
            </button>
            <Link href="/auth/sign-up">
              <button type="button" className="mt-3 btn w-full">
                회원가입
              </button>
            </Link>
            <GoogleLoginBtn />
            <GoogleSignUpBtn />
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
