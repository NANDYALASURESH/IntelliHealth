import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Search, Clock, MessageSquare, ChevronLeft } from 'lucide-react';
import { messageApi, apiRequest } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Messaging = () => {
    const { user } = useAuth();
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    useEffect(() => {
        if (selectedContact) {
            fetchConversation(selectedContact._id);
        }
    }, [selectedContact]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchContacts = async () => {
        try {
            setLoading(true);
            // For patients, contacts are their doctors. For doctors, contacts are their patients.
            const endpoint = user.role === 'patient' ? '/patient/doctors' : '/doctor/patients';
            const response = await apiRequest(endpoint);
            if (response.success) {
                const key = user.role === 'patient' ? 'doctors' : 'patients';
                setContacts(response.data[key] || []);
            }
        } catch (error) {
            console.error('Fetch contacts error:', error);
            toast.error('Failed to load contacts');
        } finally {
            setLoading(false);
        }
    };

    const fetchConversation = async (contactId) => {
        try {
            const response = await messageApi.getConversation(contactId);
            if (response.success) {
                setMessages(response.data.messages || []);
            }
        } catch (error) {
            console.error('Fetch conversation error:', error);
            toast.error('Failed to load messages');
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact || sending) return;

        try {
            setSending(true);
            const response = await messageApi.sendMessage({
                recipientId: selectedContact._id,
                body: newMessage.trim(),
                subject: 'General Inquiry'
            });

            if (response.success) {
                setMessages([...messages, response.data.message]);
                setNewMessage('');
            }
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading && contacts.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading your conversations...</div>;
    }

    return (
        <div className="h-[calc(100vh-100px)] flex bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden m-4">
            {/* Sidebar - Contacts List */}
            <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                    <div className="mt-2 relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                        <div
                            key={contact._id}
                            onClick={() => setSelectedContact(contact)}
                            className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors hover:bg-gray-50 ${selectedContact?._id === contact._id ? 'bg-blue-50' : ''
                                }`}
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {contact.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    {contact.specialization || contact.email}
                                </p>
                            </div>
                        </div>
                    ))}
                    {contacts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No contacts found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col bg-gray-50 ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setSelectedContact(null)}
                                    className="md:hidden p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <ChevronLeft className="w-6 h-6 text-gray-500" />
                                </button>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {selectedContact.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{selectedContact.name}</h3>
                                    <p className="text-xs text-green-500 font-medium">Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.sender._id === user.id
                                                ? 'bg-blue-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.body}</p>
                                        <p className={`text-[10px] mt-1 ${msg.sender._id === user.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                                    <p>Start a conversation with {selectedContact.name}</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="bg-white p-4 border-t border-gray-200">
                            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className={`p-2.5 rounded-xl transition-all ${!newMessage.trim() || sending
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md active:scale-95'
                                        }`}
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Conversations</h3>
                        <p className="text-gray-500 max-w-sm">
                            Select a contact from the list to start messaging with your doctor or patient.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messaging;
