
export const Heading = ({
    children,
    level = 2,
    className = '',
    centered = false,
    highlight = false // If true, applies text-gradient
}) => {
    const Tag = `h${level}`;

    const sizes = {
        1: 'text-4xl md:text-5xl lg:text-7xl font-bold mb-6',
        2: 'text-3xl md:text-4xl lg:text-5xl font-bold mb-6',
        3: 'text-2xl md:text-3xl font-bold mb-4',
        4: 'text-xl md:text-2xl font-semibold mb-3',
        5: 'text-lg md:text-xl font-semibold mb-2',
        6: 'text-base md:text-lg font-semibold mb-2'
    };

    return (
        <Tag className={`font-display tracking-tight ${sizes[level]} ${centered ? 'text-center' : ''} ${highlight ? 'text-gradient' : 'text-white'} ${className}`}>
            {children}
        </Tag>
    );
};

export const Text = ({
    children,
    size = 'md',
    className = '',
    centered = false,
    muted = true
}) => {
    const sizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    };

    return (
        <p className={`font-sans leading-relaxed ${sizes[size]} ${centered ? 'text-center' : ''} ${muted ? 'text-gray-400' : 'text-white'} ${className}`}>
            {children}
        </p>
    );
};
