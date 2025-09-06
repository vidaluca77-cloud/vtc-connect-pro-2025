import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VTC Connect Pro</h1>
          <p className="text-gray-600 mt-2">Créer votre compte</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
