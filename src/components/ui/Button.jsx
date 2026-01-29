import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    to,
    href,
    onClick,
    disabled = false,
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-dark';

    const variants = {
        primary: 'bg-primary text-dark hover:bg-primary-light shadow-lg hover:shadow-primary/30',
        secondary: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-dark',
        outline: 'bg-transparent border-2 border-white/20 text-white hover:bg-white hover:text-dark',
        ghost: 'bg-transparent text-primary hover:bg-primary/10',
        white: 'bg-white text-dark hover:bg-gray-200 shadow-lg'
    };

    const sizes = {
        sm: 'text-xs py-2 px-4',
        md: 'text-sm py-3 px-8',
        lg: 'text-base py-4 px-10'
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

    const content = (
        <>
            {children}
            {variant === 'primary' && !disabled && (
                <motion.span
                    className="ml-2 w-1.5 h-1.5 rounded-full bg-current opacity-60"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                />
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {content}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {content}
            </a>
        );
    }

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            type={type}
            {...props}
        >
            {content}
        </motion.button>
    );
};

export default Button;
