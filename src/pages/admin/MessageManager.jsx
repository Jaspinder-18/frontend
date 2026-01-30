import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Mail, Phone, Calendar } from 'lucide-react';

const MessageManager = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/contact');
            setMessages(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete message?')) return;
        try {
            await api.delete(`/contact/${id}`);
            setMessages(messages.filter(m => m._id !== id));
        } catch (err) {
            alert('Error deleting message');
        }
    };

    if (loading) return <div>Loading messages...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-white">Contact <span className="text-primary">Messages</span></h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map(msg => (
                    <div key={msg._id} className={`bg-dark-card border ${msg.read ? 'border-gray-800' : 'border-primary/50'} rounded-xl p-6 relative hover:bg-dark-lighter transition-colors`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-white text-lg">{msg.name}</h3>
                                <p className="text-sm text-gray-400 flex items-center gap-1"><Mail size={12} /> {msg.email}</p>
                                <p className="text-sm text-gray-400 flex items-center gap-1"><Phone size={12} /> {msg.phone}</p>
                            </div>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-dark p-3 rounded-lg text-gray-300 text-sm mb-4 min-h-[5rem]">
                            {msg.message}
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => handleDelete(msg._id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                        </div>
                        {!msg.read && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                ))}
            </div>
            {messages.length === 0 && <p className="text-gray-500 text-center">No messages found.</p>}
        </div>
    );
};

export default MessageManager;
