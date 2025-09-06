import { SignIn } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Se connecter | VTC Connect Pro',
  description: 'Connectez-vous à votre compte VTC Connect Pro pour accéder à votre tableau de bord et gérer vos services de transport.',
}

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a
              href="/sign-up"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              créez un nouveau compte
            </a>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsIconButton: 'border-gray-300 hover:bg-gray-50',
                formFieldInput: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500',
                footerActionLink: 'text-indigo-600 hover:text-indigo-500'
              }
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  )
}
