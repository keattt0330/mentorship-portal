export default function Button({ children, variant = 'primary', className = '', ...props }) {
    const baseStyle = "w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-200 transform active:scale-[0.98] flex items-center justify-center gap-2";
    
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200",
        outline: "border-2 border-slate-200 hover:border-indigo-600 text-slate-600 hover:text-indigo-600 bg-transparent",
    };

    return (
        <button 
            className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-70 disabled:cursor-not-allowed`}
            {...props}
        >
            {children}
        </button>
    );
}