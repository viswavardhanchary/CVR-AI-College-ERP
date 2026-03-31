import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChatSidebar } from './ChatSidebar';
import { ChatArea } from './ChatArea';
import { ChatProfile } from './ChatProfile';
import { ImageModal } from './ImageModal';
import { ForwardModal } from './ForwardModal';
import { connectToWebSocket, fetchChatParticipants, fetchUserChatSessions, createChatSession, addChatMessage, updateChatSession } from '../services/chat.services';
import { uploadFile } from '../services/upload.services';
import { verify } from '../services/verification.services';


const userTypeMap = {
  s: 'student',
  t: 'teacher',
  a: 'admin'
};

export function MainApp() {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useRef(null);

  const [state, setState] = useState({
    chats: [],
    messages: {},
    participants: [],
    activeChatId: null,
    isInfoOpen: false,
    fullscreenImage: null,
    forwardMessage: null,
    replyingTo: null,
    sidebarWidth: 340,
    user: null,
    college: null,
    loading: true,
    toast: null,
    onlineUsers: {},
    typingUsers: {}
  });

  const [groupModal, setGroupModal] = useState({
    open: false,
    mode: 'create',
    chatId: null,
    name: '',
    search: '',
    selected: [],
    error: null
  });

  const isResizing = useRef(false);

  const getUserDisplayName = (user) => {
    if (!user) return 'Me';
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return fullName || user.college_email || user.personal_mail || 'Me';
  };

  const formatTime = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  };

  const getQueryChatId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('chatId');
  };

  const setQueryChatId = (chatId) => {
    const params = new URLSearchParams(location.search);
    if (chatId) params.set('chatId', chatId);
    else params.delete('chatId');
    const search = params.toString();
    navigate(`${location.pathname}${search ? `?${search}` : ''}`, { replace: true });
  };

  const mapSessionToChat = (session, selfId) => {
    const participants = session.participants || [];
    const userId = String(selfId || state.user?._id || '');
    const otherParticipants = participants.filter(p => String(p.user_id || p._id || p.id || '') !== userId);
    const name = session.isGroup
      ? session.name || 'Group Chat'
      : otherParticipants[0]?.name || session.name || 'Chat';
    const avatar = session.avatar;
    const messages = session.messages || [];
    const lastMessage = session.lastMessage || (messages.length > 0 ? messages[messages.length - 1] : null);
    return {
      id: session._id,
      name,
      isGroup: Boolean(session.isGroup),
      avatar,
      participants,
      createdBy: session.createdBy || session.created_by || null,
      createdAt: session.createdAt || session.created_at || null,
      members: session.isGroup ? participants : (otherParticipants.length > 0 ? otherParticipants : participants),
      messages: messages.map(msg => ({
        ...msg,
        content: msg.text || msg.content || msg.caption || '',
        time: formatTime(msg.date),
        type: String(msg.sender?.user_id || '') === userId ? 'out' : 'in'
      })),
      lastMessage: lastMessage?.text || lastMessage?.content || lastMessage?.caption || '',
      time: lastMessage ? formatTime(lastMessage.date) : '',
      unread: session.unreadCount || 0,
      status: 'read',
      isFavorite: Boolean(session.isFavorite),
      isImportant: Boolean(session.isImportant)
    };
  };

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const resize = useCallback((e) => {
    if (!isResizing.current) return;
    let newWidth = e.clientX;
    const maxAllowedWidth = window.innerWidth / 2;
    if (newWidth < 250) newWidth = 250;
    if (newWidth > maxAllowedWidth) newWidth = maxAllowedWidth;
    setState(prev => ({ ...prev, sidebarWidth: newWidth }));
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  useEffect(() => {
    initializeChat();
    return () => {
      socket.current?.disconnect();
    };
  }, []);

  const initializeChat = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const auth = await verify(location, type);
      if (!auth.status) {
        if (auth.redirectURL) {
          navigate(auth.redirectURL, { replace: true });
        }
        setState(prev => ({ ...prev, loading: false, toast: { type: 'error', message: auth.message || 'Authorization failed' } }));
        return;
      }

      const currentUser = auth.user;
      const currentCollege = auth.college;
      const queryChatId = getQueryChatId();
      setState(prev => ({ ...prev, user: currentUser, college: currentCollege, loading: false }));
      await loadParticipants(currentCollege._id);
      const sessions = await loadChatSessions(currentCollege._id, currentUser._id, queryChatId);
      connectSocket(currentUser, currentCollege, queryChatId, sessions);
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, toast: { type: 'error', message: error.message || 'Failed to initialize chat' } }));
    }
  };

  const loadParticipants = async (collegeId) => {
    try {
      const response = await fetchChatParticipants(collegeId, type);
      if (response?.data) {
        setState(prev => ({ ...prev, participants: response.data }));
      }
    } catch (error) {
      console.error('Failed to load participants', error);
    }
  };

  const loadChatSessions = async (collegeId, userId, initialChatId = null) => {
    try {
      const response = await fetchUserChatSessions(collegeId, userId, type);
      if (response?.data) {
        const sessions = response.data.map(session => mapSessionToChat(session, userId));
        const sessionMessages = {};
        sessions.forEach(session => {
          sessionMessages[session.id] = session.messages || [];
        });

        const nextState = {
          chats: sessions.length ? sessions : [],
          messages: { ...state.messages, ...sessionMessages }
        };

        if (initialChatId && sessions.some(session => session.id === initialChatId)) {
          nextState.activeChatId = initialChatId;
          nextState.chats = sessions.map(chat => chat.id === initialChatId ? { ...chat, unread: 0 } : chat);
        } else if (initialChatId) {
          setQueryChatId(null);
        }

        setState(prev => ({ ...prev, ...nextState }));
        return sessions;
      }
    } catch (error) {
      console.error('Failed to load sessions', error);
    }
  };

  const openGroupModal = () => setGroupModal({ open: true, mode: 'create', chatId: null, name: '', search: '', selected: [], error: null });
  const openAddMembersModal = (chat) => setGroupModal({
    open: true,
    mode: 'add',
    chatId: chat?.id || null,
    name: '',
    search: '',
    selected: [],
    error: null
  });
  const closeGroupModal = () => setGroupModal({ open: false, mode: 'create', chatId: null, name: '', search: '', selected: [], error: null });

  const handleToggleGroupMember = (userId) => {
    setGroupModal(prev => ({
      ...prev,
      selected: prev.selected.includes(userId)
        ? prev.selected.filter(id => id !== userId)
        : [...prev.selected, userId],
      error: null
    }));
  };

  const handleGroupSearchChange = (value) => {
    setGroupModal(prev => ({ ...prev, search: value }));
  };

  const handleGroupNameChange = (value) => {
    setGroupModal(prev => ({ ...prev, name: value, error: null }));
  };

  const handleCreateGroup = async () => {
    if (!state.user || !state.college) {
      setGroupModal(prev => ({ ...prev, error: 'Unable to create group without current account.' }));
      return;
    }

    if (groupModal.mode === 'add') {
      const chat = state.chats.find(c => c.id === groupModal.chatId);
      if (!chat) {
        setGroupModal(prev => ({ ...prev, error: 'Unable to find the selected group.' }));
        return;
      }

      const selectedMembers = state.participants
        .filter(participant => groupModal.selected.includes(participant.user_id))
        .filter(participant => !chat.participants.some(existing => String(existing.user_id) === String(participant.user_id)));

      if (selectedMembers.length < 1) {
        setGroupModal(prev => ({ ...prev, error: 'Select at least one new member to add.' }));
        return;
      }

      const newParticipants = selectedMembers.map(participant => ({
        user_type: participant.user_type || 'student',
        user_id: participant.user_id,
        name: participant.name,
        avatar: participant.avatar,
        role: participant.role || participant.user_type || 'student',
        roll_no: participant.roll_no || ''
      }));

      const updatedParticipants = [...chat.participants, ...newParticipants];

      try {
        const response = await updateChatSession(state.college._id, groupModal.chatId, { participants: updatedParticipants }, type);
        if (response?.data) {
          const updatedSession = mapSessionToChat(response.data, state.user._id);
          setState(prev => ({
            ...prev,
            chats: prev.chats.map(item => item.id === updatedSession.id ? updatedSession : item)
          }));
          closeGroupModal();
        }
      } catch (error) {
        console.error('Failed to add members to group chat', error);
        setGroupModal(prev => ({ ...prev, error: error.message || 'Could not add members. Please try again.' }));
      }

      return;
    }

    const selectedMembers = state.participants
      .filter(participant => groupModal.selected.includes(participant.user_id))
      .filter(participant => String(participant.user_id) !== String(state.user._id));

    if (!groupModal.name.trim()) {
      setGroupModal(prev => ({ ...prev, error: 'Please enter a group name.' }));
      return;
    }

    if (selectedMembers.length < 1) {
      setGroupModal(prev => ({ ...prev, error: 'Select at least one member to start the group.' }));
      return;
    }

    const currentUserParticipant = {
      user_type: userTypeMap[type] || 'student',
      user_id: state.user._id,
      name: getUserDisplayName(state.user),
      avatar: state.user.profile,
      role: userTypeMap[type] || 'student',
      roll_no: state.user.roll_no || ''
    };

    const groupParticipants = [
      currentUserParticipant,
      ...selectedMembers.map(participant => ({
        user_type: participant.user_type || 'student',
        user_id: participant.user_id,
        name: participant.name,
        avatar: participant.avatar,
        role: participant.role || participant.user_type || 'student',
        roll_no: participant.roll_no || ''
      }))
    ];

    try {
      const payload = {
        isGroup: true,
        name: groupModal.name.trim(),
        participants: groupParticipants,
        createdBy: currentUserParticipant
      };

      const response = await createChatSession(state.college._id, payload, type);
      if (response?.data) {
        const newSession = mapSessionToChat(response.data, state.user._id);
        setState(prev => ({ ...prev, chats: [...prev.chats, newSession], activeChatId: newSession.id }));
        if (state.college) {
          joinRoom(state.college._id, newSession.id);
        }
        setQueryChatId(newSession.id);
        closeGroupModal();
      }
    } catch (error) {
      console.error('Failed to create group chat', error);
      setGroupModal(prev => ({ ...prev, error: error.message || 'Could not create group. Please try again.' }));
    }
  };

  const handleExitGroup = async (chat) => {
    if (!chat || !state.user || !state.college) return;
    if (!window.confirm('Leave this group? You will be removed from the group and it will disappear from your chat history.')) return;

    const remainingParticipants = (chat.participants || []).filter(participant => String(participant.user_id) !== String(state.user._id));

    try {
      const response = await updateChatSession(state.college._id, chat.id, { participants: remainingParticipants }, type);
      if (response?.data) {
        setState(prev => {
          const nextMessages = { ...prev.messages };
          delete nextMessages[chat.id];
          return {
            ...prev,
            chats: prev.chats.filter(item => item.id !== chat.id),
            messages: nextMessages,
            activeChatId: prev.activeChatId === chat.id ? null : prev.activeChatId,
            isInfoOpen: prev.activeChatId === chat.id ? false : prev.isInfoOpen
          };
        });
        setQueryChatId(null);
      }
    } catch (error) {
      console.error('Failed to leave group', error);
      alert(error.message || 'Could not leave group. Please try again.');
    }
  };

  const connectSocket = (user, college, initialChatId = null, sessions = []) => {
    socket.current = connectToWebSocket();

    socket.current.on('connect', () => {
      socket.current.emit('register', {
        collegeId: college._id,
        userId: user._id,
        userType: userTypeMap[type] || 'student',
        name: getUserDisplayName(user),
        avatar: user.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user._id}`
      });
      sessions.forEach(session => {
        if (session?.id) {
          joinRoom(college._id, session.id);
        }
      });
      if (initialChatId) {
        joinRoom(college._id, initialChatId);
      }
    });

    socket.current.on('online-users', (users) => {
      const onlineMap = {};
      if (Array.isArray(users)) {
        users.forEach(u => {
          onlineMap[u.userId] = { ...u, status: u.status || 'online' };
        });
      }
      setState(prev => ({ ...prev, onlineUsers: onlineMap }));
    });

    socket.current.on('user-status', (payload) => {
      if (!payload?.userId) return;
      setState(prev => {
        const onlineUsers = { ...prev.onlineUsers };
        if (payload.status === 'offline') {
          delete onlineUsers[payload.userId];
        } else {
          onlineUsers[payload.userId] = { ...onlineUsers[payload.userId], ...payload };
        }
        return { ...prev, onlineUsers };
      });
    });

    socket.current.on('receive-message', (data) => {
      if (!data?.chatId) return;
      setState(prev => {
        const updatedMessages = { ...prev.messages };
        const existing = updatedMessages[data.chatId] || [];
        const incomingMessage = {
          ...data,
          type: String(data.sender?.user_id || '') === String(prev.user?._id || '') ? 'out' : 'in',
          content: data.text || data.caption || '',
          time: formatTime(data.date),
          replyTo: data.replyTo || null,
          forwardedFrom: data.forwardedFrom || null
        };
        updatedMessages[data.chatId] = [...existing, incomingMessage];

        const chatPreview = data.text || data.caption || data.forwardedFrom?.text || data.replyTo?.text || '';
        const chats = prev.chats.map(chat => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              lastMessage: chatPreview,
              time: formatTime(data.date),
              message: chatPreview,
              unread: chat.id === prev.activeChatId ? chat.unread : (chat.unread || 0) + 1
            };
          }
          return chat;
        });

        return { ...prev, messages: updatedMessages, chats };
      });
    });

    socket.current.on('typing', ({ chatId, userId, name, isTyping }) => {
      if (!chatId || !userId) return;
      setState(prev => {
        const typingUsers = { ...prev.typingUsers };
        const currentTyping = new Set(typingUsers[chatId] || []);
        if (isTyping) {
          currentTyping.add(name || 'Someone');
        } else {
          currentTyping.delete(name || userId);
        }
        typingUsers[chatId] = Array.from(currentTyping);
        return { ...prev, typingUsers };
      });
    });
  };

  const joinRoom = (collegeId, chatId) => {
    if (!socket.current || !collegeId || !chatId) return;
    socket.current.emit('join-room', { collegeId, chatId });
  };

  const handleSelectChat = (id) => {
    if (state.college) {
      joinRoom(state.college._id, id);
    }
    setState(prev => ({
      ...prev,
      activeChatId: id,
      chats: prev.chats.map(chat => chat.id === id ? { ...chat, unread: 0 } : chat)
    }));
    setQueryChatId(id);
  };

  const handleCreateChatWithParticipant = async (participant) => {
    const currentUser = state.user;
    if (!currentUser || !state.college || !participant) return;

    const existing = state.chats.find(chat =>
      !chat.isGroup &&
      chat.participants?.some(part => part.user_id === participant.user_id)
    );
    if (existing) {
      handleSelectChat(existing.id);
      return;
    }

    const payload = {
      isGroup: false,
      participants: [
        {
          user_type: userTypeMap[type] || 'student',
          user_id: currentUser._id,
          name: getUserDisplayName(currentUser),
          avatar: currentUser.profile
        },
        {
          user_type: participant.user_type || 'student',
          user_id: participant.user_id,
          name: participant.name,
          avatar: participant.avatar
        }
      ]
    };

    try {
      const response = await createChatSession(state.college._id, payload, type);
      if (response?.data) {
        const newSession = mapSessionToChat(response.data);
        setState(prev => ({ ...prev, chats: [...prev.chats, newSession], activeChatId: newSession.id }));
        if (state.college) {
          joinRoom(state.college._id, newSession.id);
        }
        setQueryChatId(newSession.id);
      }
    } catch (error) {
      console.error('Failed to create chat session', error);
    }
  };

  const handleSendMessage = async (text, media = null) => {
    if ((!text || !text.trim()) && !media) return;
    if (!state.activeChatId || !state.college || !state.user) return;

    const payload = {
      collegeId: state.college._id,
      chatId: state.activeChatId,
      sender: {
        user_type: userTypeMap[type] || 'student',
        user_id: state.user._id,
        name: getUserDisplayName(state.user),
        avatar: state.user.profile
      },
      text: text || '',
      type_media: media?.type_media || 'text',
      url: media?.url,
      caption: media?.name,
      date: new Date().toISOString()
    };

    if (state.replyingTo) {
      const replied = state.replyingTo;
      payload.replyTo = {
        messageId: replied._id || replied.id || null,
        text: replied.text || replied.content || '',
        type_media: replied.type_media,
        url: replied.url,
        caption: replied.caption,
        upload_id: replied.upload_id,
        type: replied.type,
        sender: replied.sender || { name: replied.sender?.name || replied.sender }
      };
    }

    if (media?.file) {
      const formData = new FormData();
      formData.append('file', media.file);
      formData.append('type', userTypeMap[type] || 'student');
      formData.append('id', state.user._id);

      const uploadResult = await uploadFile(state.college._id, formData);
      if (!uploadResult.status || !uploadResult.upload) {
        console.error('Upload failed:', uploadResult);
        setState(prev => ({ ...prev, toast: { type: 'error', message: 'Attachment upload failed. Please try again.' } }));
        return;
      }

      payload.url = uploadResult.upload.file_url;
      payload.caption = uploadResult.upload.original_name || payload.caption;
      payload.upload_id = uploadResult.upload._id;
    } else if (media?.upload_id) {
      payload.upload_id = media.upload_id;
    }

    socket.current?.emit('send-message', payload);

    const optimisticMessage = {
      type: 'out',
      content: text || media?.caption || media?.name || '',
      time: formatTime(payload.date),
      status: 'sent',
      ...media,
      sender: payload.sender,
      upload_id: payload.upload_id,
      url: payload.url,
      replyTo: payload.replyTo
    };

    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [prev.activeChatId]: [...(prev.messages[prev.activeChatId] || []), optimisticMessage]
      },
      replyingTo: null
    }));
  };

  const handleForwardMessage = async (targetChatIds) => {
    if (!state.forwardMessage || !state.college || !state.user) return;

    const forwardedPayload = {
      collegeId: state.college._id,
      sender: {
        user_type: userTypeMap[type] || 'student',
        user_id: state.user._id,
        name: getUserDisplayName(state.user),
        avatar: state.user.profile
      },
      text: state.forwardMessage.content || state.forwardMessage.text || '',
      type_media: state.forwardMessage.type_media || 'text',
      url: state.forwardMessage.url,
      caption: state.forwardMessage.caption || state.forwardMessage.name,
      date: new Date().toISOString(),
      forwardedFrom: {
        originalChatId: state.activeChatId,
        messageId: state.forwardMessage._id || state.forwardMessage.id || null,
        originalSender: state.forwardMessage.sender,
        text: state.forwardMessage.content || state.forwardMessage.text || '',
        type_media: state.forwardMessage.type_media,
        url: state.forwardMessage.url,
        caption: state.forwardMessage.caption || state.forwardMessage.name,
        upload_id: state.forwardMessage.upload_id
      }
    };

    const results = await Promise.all(targetChatIds.map(async chatId => {
      try {
        const payload = { ...forwardedPayload, chatId };
        if (socket.current) {
          socket.current.emit('send-message', payload);
          return { chatId, success: true, payload };
        }
        await addChatMessage(state.college._id, chatId, payload, type);
        return { chatId, success: true, payload };
      } catch (error) {
        console.error('Forward failed for', chatId, error);
        return { chatId, success: false };
      }
    }));

    const successful = results.filter(r => r.success);
    if (successful.length === 0) {
      setState(prev => ({ ...prev, toast: { type: 'error', message: 'Forward failed for all selected chats.' } }));
      return;
    }

    setState(prev => {
      const updatedMessages = { ...prev.messages };
      successful.forEach(r => {
        const message = {
          ...r.payload,
          type: 'out',
          content: r.payload.text || r.payload.caption || '',
          time: formatTime(r.payload.date),
          forwardedFrom: r.payload.forwardedFrom
        };
        updatedMessages[r.chatId] = [...(updatedMessages[r.chatId] || []), message];
      });
      return { ...prev, messages: updatedMessages, forwardMessage: null };
    });
  };

  const handleTyping = (isTyping) => {
    if (!state.activeChatId || !socket.current || !state.college || !state.user) return;
    socket.current.emit('typing', {
      collegeId: state.college._id,
      chatId: state.activeChatId,
      userId: state.user._id,
      name: getUserDisplayName(state.user),
      isTyping
    });
  };

  const handleDeleteSpecificMessage = (index) => {
    setState(prev => {
      const updatedChat = [...(prev.messages[prev.activeChatId] || [])];
      updatedChat.splice(index, 1);
      return { ...prev, messages: { ...prev.messages, [prev.activeChatId]: updatedChat } };
    });
  };

  const handleAddReaction = (index, emoji) => {
    setState(prev => {
      const updatedChat = [...(prev.messages[prev.activeChatId] || [])];
      const msg = { ...updatedChat[index] };
      msg.reactions = msg.reactions || [];
      if (!msg.reactions.includes(emoji)) msg.reactions.push(emoji);
      updatedChat[index] = msg;
      return { ...prev, messages: { ...prev.messages, [prev.activeChatId]: updatedChat } };
    });
  };

  const handleToggleFavorite = async (chatId) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => chat.id === chatId ? { ...chat, isFavorite: !chat.isFavorite } : chat)
    }));
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat || !state.college) return;
    try {
      await updateChatSession(state.college._id, chatId, { isFavorite: !chat.isFavorite }, type);
    } catch (error) {
      console.error('Failed to update favorite status', error);
    }
  };

  const handleToggleImportant = async (chatId) => {
    setState(prev => ({
      ...prev,
      chats: prev.chats.map(chat => chat.id === chatId ? { ...chat, isImportant: !chat.isImportant } : chat)
    }));
    const chat = state.chats.find(c => c.id === chatId);
    if (!chat || !state.college) return;
    try {
      await updateChatSession(state.college._id, chatId, { isImportant: !chat.isImportant }, type);
    } catch (error) {
      console.error('Failed to update important status', error);
    }
  };

  const toggleInfoPanel = () => {
    setState(prev => ({ ...prev, isInfoOpen: !prev.isInfoOpen }));
  };

  const handleClearChat = (id) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to clear all messages for this chat?')) {
      setState(prev => ({ ...prev, messages: { ...prev.messages, [id]: [] } }));
    }
  };

  const handleDeleteChat = (id) => {
    if (!id) return;
    if (window.confirm('Delete this conversation?')) {
      setState(prev => ({
        ...prev,
        chats: prev.chats.filter(chat => chat.id !== id),
        activeChatId: prev.activeChatId === id ? null : prev.activeChatId,
        isInfoOpen: prev.activeChatId === id ? false : prev.isInfoOpen
      }));
      if (state.activeChatId === id) {
        setQueryChatId(null);
      }
    }
  };

  const displayChats = state.chats.map(chat => {
    const chatMsgs = state.messages[chat.id] || [];
    const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
    const previewText = lastMsg ? (lastMsg.type_media === 'img' ? '📷 Photo' : lastMsg.type_media === 'video' ? '🎥 Video' : lastMsg.type_media === 'audio' ? '🎤 Voice Note' : lastMsg.type_media === 'doc' ? '📄 Document' : lastMsg.content) : chat.message;
    const participants = chat.participants || [];
    const otherParticipants = participants.filter(part => String(part.user_id) !== String(state.user?._id));
    const onlineCount = otherParticipants.reduce((count, part) => (state.onlineUsers[String(part.user_id)] ? count + 1 : count), 0);
    return {
      ...chat,
      message: previewText,
      time: lastMsg ? lastMsg.time : chat.time || '',
      onlineCount,
      online: onlineCount > 0
    };
  });

  const activeChat = displayChats.find(c => c.id === state.activeChatId);
  const isAddingMembers = groupModal.mode === 'add';
  const activeGroupForAdd = isAddingMembers ? state.chats.find(chat => chat.id === groupModal.chatId) : null;
  const activeGroupMemberIds = new Set(activeGroupForAdd?.participants?.map(member => String(member.user_id)) || []);
  const modalCandidateParticipants = state.participants
    .filter(participant => String(participant.user_id) !== String(state.user?._id))
    .filter(participant => !isAddingMembers || !activeGroupMemberIds.has(String(participant.user_id)));
  const filteredModalCandidates = modalCandidateParticipants.filter(participant => {
    if (!groupModal.search.trim()) return true;
    return participant.name.toLowerCase().includes(groupModal.search.toLowerCase()) || (participant.user_type || '').toLowerCase().includes(groupModal.search.toLowerCase());
  });

  return (
    <div className="flex h-screen w-screen bg-[#f1f5f9] text-[#1e293b] overflow-hidden antialiased font-['Inter']">
      <div style={{ width: state.sidebarWidth, minWidth: 250, maxWidth: '50vw' }} className="h-full shrink-0 flex flex-col z-10 max-md:w-full! max-md:fixed max-md:inset-0 max-md:z-50">
        <ChatSidebar
          chats={displayChats}
          participants={state.participants}
          onlineUsers={state.onlineUsers}
          activeChatId={state.activeChatId}
          onSelectChat={handleSelectChat}
          onSelectParticipant={handleCreateChatWithParticipant}
          onCreateGroup={openGroupModal}
          onToggleFavorite={handleToggleFavorite}
          onToggleImportant={handleToggleImportant}
          onClearChat={handleClearChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      <div onMouseDown={startResizing} className="max-md:hidden w-1 cursor-col-resize bg-transparent hover:bg-blue-400 active:bg-blue-500 transition-colors z-50 shrink-0"></div>

      <div className="relative flex-1 flex overflow-hidden">
        <ChatArea
          activeChat={activeChat}
          messages={state.messages[state.activeChatId] || []}
          onSendMessage={handleSendMessage}
          onToggleInfo={toggleInfoPanel}
          onBack={() => {setState(prev => ({ ...prev, activeChatId: null }));navigate(location.pathname, {replace: true})}}
          onImageClick={(url) => setState(prev => ({ ...prev, fullscreenImage: url }))}
          onForwardClick={(msg) => setState(prev => ({ ...prev, forwardMessage: msg }))}
          replyingTo={state.replyingTo}
          onSetReply={(msg) => setState(prev => ({ ...prev, replyingTo: msg }))}
          onDeleteMessage={handleDeleteSpecificMessage}
          onAddReaction={handleAddReaction}
          onToggleFavorite={() => handleToggleFavorite(state.activeChatId)}
          onToggleImportant={() => handleToggleImportant(state.activeChatId)}
          onClearChat={() => handleClearChat(state.activeChatId)}
          onDeleteChat={() => handleDeleteChat(state.activeChatId)}
          onTyping={handleTyping}
          typingUsers={state.typingUsers[state.activeChatId] || []}
        />

        {state.isInfoOpen && activeChat && (
          <ChatProfile
            activeChat={activeChat}
            messages={state.messages[state.activeChatId] || []}
            onlineUsers={state.onlineUsers}
            onAddMembers={openAddMembersModal}
            onExitGroup={handleExitGroup}
            onClose={() => setState(prev => ({ ...prev, isInfoOpen: false }))}
            onToggleFavorite={() => handleToggleFavorite(state.activeChatId)}
            onToggleImportant={() => handleToggleImportant(state.activeChatId)}
            onClearChat={() => handleClearChat(state.activeChatId)}
            onDeleteChat={() => handleDeleteChat(state.activeChatId)}
            onImageClick={(url) => setState(prev => ({ ...prev, fullscreenImage: url }))}
          />
        )}
      </div>

      {state.forwardMessage && (
        <ForwardModal
          chats={displayChats}
          onClose={() => setState(prev => ({ ...prev, forwardMessage: null }))}
          onForward={(targetChatIds) => {
            handleForwardMessage(targetChatIds);
          }}
        />
      )}

      {state.fullscreenImage && <ImageModal imageUrl={state.fullscreenImage} onClose={() => setState(prev => ({ ...prev, fullscreenImage: null }))} />}

      {groupModal.open && (
        <div className="fixed inset-0 z-300 bg-black/50 backdrop-blur-sm flex items-center justify-center animate-[fadeIn_0.15s_ease-out]" onClick={closeGroupModal}>
          <div className="bg-white w-[min(92vw,720px)] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{isAddingMembers ? `Add Members to ${activeGroupForAdd?.name || 'Group'}` : 'Create Group Chat'}</h2>
                <p className="text-sm text-slate-500">{isAddingMembers ? 'Choose new participants to add to this group.' : 'Add a name and choose members from your college list.'}</p>
              </div>
              <button onClick={closeGroupModal} className="text-slate-400 hover:text-slate-700 outline-none">✕</button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {!isAddingMembers && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={groupModal.name}
                    onChange={(e) => handleGroupNameChange(e.target.value)}
                    placeholder="e.g. Project Team, Study Group"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search college members</label>
                <input
                  type="text"
                  value={groupModal.search}
                  onChange={(e) => handleGroupSearchChange(e.target.value)}
                  placeholder="Search by name or role"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Select Members</h3>
                  <span className="text-xs text-slate-500">{groupModal.selected.length} selected</span>
                </div>
                <div className="grid gap-2 max-h-[40vh] overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50">
                  {filteredModalCandidates.map(participant => {
                    const selected = groupModal.selected.includes(participant.user_id);
                    return (
                      <button
                        key={participant.user_id}
                        type="button"
                        onClick={() => handleToggleGroupMember(participant.user_id)}
                        className={`w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors ${selected ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 hover:bg-slate-100'}`}
                      >
                        <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-white bg-white text-blue-600' : 'border-slate-300'}`}>
                          {selected ? '✓' : ''}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium">{participant.name}</p>
                          <p className="truncate text-xs text-slate-500">{participant.user_type || 'College member'}</p>
                        </div>
                      </button>
                    );
                  })}
                  {filteredModalCandidates.length === 0 && (
                    <div className="px-4 py-8 text-center text-sm text-slate-500">No members found.</div>
                  )}
                </div>
              </div>

              {groupModal.error && <p className="text-sm text-red-600">{groupModal.error}</p>}
            </div>

            <div className="flex items-center gap-3 justify-end p-5 border-t border-slate-200 bg-slate-50">
              <button onClick={closeGroupModal} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancel</button>
              <button onClick={handleCreateGroup} className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{isAddingMembers ? 'Add Members' : 'Create Group'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
