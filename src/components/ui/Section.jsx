const Section = ({
    children,
    className = '',
    id = '',
    background = 'default',
    container = true
}) => {
    const backgrounds = {
        default: 'bg-dark',
        lighter: 'bg-dark-lighter',
        gradient: 'bg-gradient-to-b from-dark to-dark-lighter',
        none: ''
    };

    return (
        <section
            id={id}
            className={`section-padding relative overflow-hidden ${backgrounds[background]} ${className}`}
        >
            {container ? (
                <div className="container-custom relative z-10">
                    {children}
                </div>
            ) : (
                children
            )}
        </section>
    );
};

export default Section;
