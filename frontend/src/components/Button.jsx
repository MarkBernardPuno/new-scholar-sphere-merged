// A reusable button component
export default function Button({ children, ...props }) {
  return (
    <button
      className="w-full py-3 text-white font-bold bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg hover:from-blue-800 hover:to-purple-800 shadow-lg transition"
      {...props}
    >
      {children}
    </button>
  );
}
