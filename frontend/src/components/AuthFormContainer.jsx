// A reusable form container for auth pages
export default function AuthFormContainer({ title, subtitle, children }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-md p-10 bg-white/90 rounded-2xl shadow-2xl border border-gray-200 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-800 mb-2 drop-shadow">{title}</h2>
        <p className="mb-6 text-base text-center text-gray-600">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
