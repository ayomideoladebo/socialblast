"use client";

import { useState, useEffect } from "react";
import { FiMessageSquare, FiPlus, FiChevronRight, FiCheck, FiClock, FiX } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

type Ticket = {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: 'open' | 'closed' | 'pending';
  created_at: string;
  updated_at: string;
};

type TicketReply = {
  id: string;
  ticket_id: string;
  user_id: string;
  is_admin: boolean;
  message: string;
  created_at: string;
};

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showTicketDetailsModal, setShowTicketDetailsModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  
  // New ticket form
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Reply form
  const [replyMessage, setReplyMessage] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Get user's support tickets
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (ticketError) throw ticketError;
      setTickets(ticketData || []);
      
    } catch (error) {
      console.error('Error fetching support tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Create new support ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert({
          user_id: session.user.id,
          subject: subject.trim(),
          message: message.trim(),
          status: 'open'
        })
        .select()
        .single();
        
      if (ticketError) throw ticketError;
      
      alert('Support ticket created successfully!');
      setShowNewTicketModal(false);
      setSubject("");
      setMessage("");
      fetchTickets();
      
    } catch (error) {
      console.error('Error creating support ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const viewTicketDetails = async (ticket: Ticket) => {
    try {
      setSelectedTicket(ticket);
      setShowTicketDetailsModal(true);
      
      // Get ticket replies
      const { data: replyData, error: replyError } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });
        
      if (replyError) throw replyError;
      setTicketReplies(replyData || []);
      
    } catch (error) {
      console.error('Error fetching ticket replies:', error);
    }
  };

  const submitReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) {
      alert('Please enter a message');
      return;
    }
    
    try {
      setSubmittingReply(true);
      
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      // Create new ticket reply
      const { error: replyError } = await supabase
        .from('ticket_replies')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: session.user.id,
          is_admin: false,
          message: replyMessage.trim()
        });
        
      if (replyError) throw replyError;
      
      // Update ticket status to pending
      const { error: updateError } = await supabase
        .from('support_tickets')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .eq('id', selectedTicket.id);
        
      if (updateError) throw updateError;
      
      // Refresh ticket replies
      const { data: replyData, error: fetchError } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', selectedTicket.id)
        .order('created_at', { ascending: true });
        
      if (fetchError) throw fetchError;
      setTicketReplies(replyData || []);
      
      // Reset form
      setReplyMessage("");
      
      // Refresh tickets list
      fetchTickets();
      
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setSubmittingReply(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <FiMessageSquare className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <FiClock className="h-5 w-5 text-yellow-500" />;
      case 'closed':
        return <FiCheck className="h-5 w-5 text-green-500" />;
      default:
        return <FiMessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Open
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Awaiting Response
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
        <button 
          onClick={() => setShowNewTicketModal(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <FiPlus className="mr-2 h-4 w-4" />
          New Ticket
        </button>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Your Support Tickets</h2>
        
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        ) : tickets.length > 0 ? (
          <div className="overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {tickets.map((ticket) => (
                <li key={ticket.id}>
                  <button
                    onClick={() => viewTicketDetails(ticket)}
                    className="block w-full cursor-pointer px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(ticket.status)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {ticket.subject}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Created on {new Date(ticket.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusBadge(ticket.status)}
                        <FiChevronRight className="ml-2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center">
            <FiMessageSquare className="mb-2 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-lg text-gray-500 dark:text-gray-400">No support tickets yet</p>
            <p className="mb-4 text-sm text-gray-400 dark:text-gray-500">
              Create a new ticket if you need help with anything
            </p>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <FiPlus className="mr-2 h-4 w-4" />
              New Ticket
            </button>
          </div>
        )}
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Help Center</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Find answers to common questions about our services
            </p>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              View FAQs
            </a>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
              User Guides
            </h3>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Step-by-step guides on how to use our services
            </p>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              View Guides
            </a>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <h3 className="mb-2 text-base font-medium text-gray-900 dark:text-white">
              Contact Us
            </h3>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Get in touch with our support team
            </p>
            <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Contact Support
            </a>
          </div>
        </div>
      </div>
      
      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Support Ticket
              </h2>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Brief description of your issue"
              />
            </div>
            
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                placeholder="Please describe your issue in detail"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewTicketModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={createTicket}
                disabled={submitting || !subject.trim() || !message.trim()}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {submitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Ticket Details Modal */}
      {showTicketDetailsModal && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Ticket: {selectedTicket.subject}
              </h2>
              <button
                onClick={() => setShowTicketDetailsModal(false)}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">Status:</span>
                {getStatusBadge(selectedTicket.status)}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(selectedTicket.created_at).toLocaleString()}
              </span>
            </div>
            
            <div className="mb-6 max-h-96 overflow-y-auto">
              {/* Original ticket message */}
              <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 h-8 w-8 rounded-full bg-indigo-100 text-center leading-8 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
                    Y
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">You</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(selectedTicket.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedTicket.message}</p>
              </div>
              
              {/* Ticket replies */}
              {ticketReplies.map((reply) => (
                <div 
                  key={reply.id} 
                  className={`mb-4 rounded-lg p-4 ${
                    reply.is_admin 
                      ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="mb-2 flex items-center">
                    <div 
                      className={`mr-2 h-8 w-8 rounded-full text-center leading-8 ${
                        reply.is_admin 
                          ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {reply.is_admin ? 'A' : 'Y'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {reply.is_admin ? 'Support Agent' : 'You'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(reply.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{reply.message}</p>
                </div>
              ))}
            </div>
            
            {/* Reply form */}
            {selectedTicket.status !== 'closed' && (
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Reply
                </label>
                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  placeholder="Type your reply here..."
                ></textarea>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowTicketDetailsModal(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Close
              </button>
              {selectedTicket.status !== 'closed' && (
                <button
                  type="button"
                  onClick={submitReply}
                  disabled={submittingReply || !replyMessage.trim()}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  {submittingReply ? 'Sending...' : 'Send Reply'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}