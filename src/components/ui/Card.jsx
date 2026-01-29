import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={`glass-card overflow-hidden transition-shadow duration-300 ${hover ? 'hover:shadow-xl hover:shadow-primary/5' : ''} ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default Card;
