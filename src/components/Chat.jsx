import React from 'react';
import {
  FaArrowLeft, FaSearch, FaTimes, FaPaperPlane,
  FaEllipsisH, FaReply, FaCopy,
  FaTrash, FaForward, FaCheck
} from 'react-icons/fa';

class Chat extends React.Component {

  constructor(props) {
    super(props);
    this.messagesEndRef = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.currentChat?.messages?.length !==
      this.props.currentChat?.messages?.length
    ) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  renderChatList() {
    const {
      darkMode, chats, chatSearchQuery, showChatSearch,
      forwardingPost, forwardingMessage, selectedChatsForForward,
      onOpenChat, onToggleChatSearch, onChatSearchChange,
      onToggleChatSelection, onSendForwardedPost,
      onSendForwardedMessage, onCancelForward
    } = this.props;

    const color = darkMode ? '#fff' : '#000';
    const subColor = darkMode ? '#999' : '#666';
    const bg = darkMode ? '#000' : '#fff';
    const border = darkMode ? '#222' : '#f0f0f0';

    const isForwarding = forwardingPost || forwardingMessage;

    const filteredChats = chatSearchQuery
      ? chats.filter(c =>
          c.user.name.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
          c.user.username.toLowerCase().includes(chatSearchQuery.toLowerCase())
        )
      : chats;

    return (
      <div style={{
        minHeight: '100vh', backgroundColor: bg,
        fontFamily: "'Noto Sans', system-ui, sans-serif",
        paddingBottom: '70px'
      }}>
        {/* Header */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          backgroundColor: bg, borderBottom: `1px solid ${border}`,
          zIndex: 100, padding: '16px'
        }}>
          {isForwarding ? (
            <div>
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: '8px'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color, margin: 0 }}>
                  Forward to...
                </h2>
                <button onClick={onCancelForward} style={{
                  backgroundColor: 'transparent', border: 'none',
                  color: subColor, cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}>
                  <FaTimes size={20} />
                </button>
              </div>
              <div style={{
                padding: '10px 12px',
                backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                borderRadius: '8px', fontSize: '13px', color: subColor
              }}>
                {forwardingPost
                  ? '📤 Forwarding a post'
                  : `📤 "${forwardingMessage?.text?.substring(0, 50)}..."`
                }
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {showChatSearch ? (
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
                  <input
                    autoFocus
                    type="text"
                    value={chatSearchQuery}
                    onChange={(e) => onChatSearchChange(e.target.value)}
                    placeholder="Search chats..."
                    style={{
                      flex: 1, padding: '10px 14px',
                      backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                      border: 'none', borderRadius: '10px',
                      color, fontSize: '15px', outline: 'none',
                      caretColor: '#FE2C55'
                    }}
                  />
                  <button onClick={onToggleChatSearch} style={{
                    backgroundColor: 'transparent', border: 'none',
                    color: subColor, cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent'
                  }}>
                    <FaTimes size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color, margin: 0 }}>
                    Messages
                  </h2>
                  <button onClick={onToggleChatSearch} style={{
                    backgroundColor: 'transparent', border: 'none',
                    color, cursor: 'pointer', padding: '4px',
                    WebkitTapHighlightColor: 'transparent'
                  }}>
                    <FaSearch size={20} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Chat List */}
        <div style={{ paddingTop: isForwarding ? '110px' : '72px' }}>
          {filteredChats.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color, marginBottom: '8px' }}>
                No messages yet
              </h3>
              <p style={{ fontSize: '15px', color: subColor }}>
                Start a conversation from someone's profile
              </p>
            </div>
          ) : (
            filteredChats.map(chat => {
              const isSelected = selectedChatsForForward.includes(chat.id);
              return (
                <button
                  key={chat.id}
                  onClick={() => isForwarding ? onToggleChatSelection(chat.id) : onOpenChat(chat)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center',
                    padding: '14px 16px', gap: '12px',
                    backgroundColor: isSelected ? (darkMode ? '#1a1a1a' : '#fff5f7') : 'transparent',
                    border: 'none', borderBottom: `1px solid ${border}`,
                    cursor: 'pointer', textAlign: 'left',
                    WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: '50px', height: '50px', borderRadius: '50%',
                      overflow: 'hidden',
                      backgroundColor: darkMode ? '#222' : '#f0f0f0',
                      border: isSelected ? '2px solid #FE2C55' : 'none'
                    }}>
                      <img
                        src={chat.user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${chat.user.username}`}
                        alt={chat.user.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    {isSelected && (
                      <div style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: '18px', height: '18px', borderRadius: '50%',
                        backgroundColor: '#FE2C55',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `2px solid ${bg}`
                      }}>
                        <FaCheck size={10} color="white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '15px', color }}>
                        {chat.user.name}
                      </span>
                      <span style={{ fontSize: '12px', color: subColor }}>
                        {chat.timestamp}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '14px', color: subColor,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }}>
                      {chat.lastMessage || 'No messages yet'}
                    </div>
                  </div>

                  {/* Unread badge */}
                  {chat.unread > 0 && !isForwarding && (
                    <div style={{
                      minWidth: '20px', height: '20px', borderRadius: '10px',
                      backgroundColor: '#FE2C55',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 'bold', color: 'white',
                      padding: '0 4px', flexShrink: 0
                    }}>
                      {chat.unread}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Forward Send Button */}
        {isForwarding && selectedChatsForForward.length > 0 && (
          <button
            onClick={forwardingPost ? onSendForwardedPost : onSendForwardedMessage}
            style={{
              position: 'fixed', bottom: '80px', right: '20px',
              backgroundColor: '#FE2C55', border: 'none', borderRadius: '50%',
              width: '56px', height: '56px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 12px rgba(254,44,85,0.4)',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <FaPaperPlane size={22} color="white" />
          </button>
        )}
      </div>
    );
  }

  renderChatDetail() {
    const {
      darkMode, currentChat, newMessage, replyingTo,
      popularEmojis, onBack, onSendMessage, onMessageChange,
      onCancelReply, onMessageTouchStart, onMessageTouchEnd,
      onMessageDoubleClick, showMessageActions, currentMessageActions,
      onReplyToMessage, onCopyMessage, onDeleteMessage,
      onForwardMessage, onCloseMessageActions, messageReactions,
      onAddEmojiReaction
    } = this.props;

    const color = darkMode ? '#fff' : '#000';
    const subColor = darkMode ? '#999' : '#666';
    const bg = darkMode ? '#000' : '#fff';
    const border = darkMode ? '#222' : '#f0f0f0';

    if (!currentChat) return null;

    return (
      <div style={{
        minHeight: '100vh', backgroundColor: darkMode ? '#0a0a0a' : '#f5f5f5',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Noto Sans', system-ui, sans-serif"
      }}>
        {/* Header */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          backgroundColor: bg, borderBottom: `1px solid ${border}`,
          zIndex: 100, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <button onClick={onBack} style={{
            backgroundColor: 'transparent', border: 'none',
            color, cursor: 'pointer', padding: '4px',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <FaArrowLeft size={20} />
          </button>

          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            overflow: 'hidden', backgroundColor: darkMode ? '#222' : '#f0f0f0'
          }}>
            <img
              src={currentChat.user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentChat.user.username}`}
              alt={currentChat.user.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color }}>
              {currentChat.user.name}
            </div>
            <div style={{ fontSize: '12px', color: subColor }}>
              @{currentChat.user.username}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px', paddingTop: '80px', paddingBottom: '100px'
        }}>
          {currentChat.messages && currentChat.messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: subColor }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>👋</div>
              <p style={{ fontSize: '15px' }}>Say hello to {currentChat.user.name}!</p>
            </div>
          ) : (
            currentChat.messages?.map(msg => {
              const isYou = msg.isYou;
              const isActions = currentMessageActions === msg.id && showMessageActions;
              const reactions = messageReactions[msg.id] || [];

              return (
                <div key={msg.id} style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: isYou ? 'flex-end' : 'flex-start',
                  marginBottom: '12px'
                }}>
                  {/* Reply preview */}
                  {msg.replyTo && (
                    <div style={{
                      maxWidth: '75%', padding: '6px 10px',
                      backgroundColor: darkMode ? '#1a1a1a' : '#e8e8e8',
                      borderRadius: '8px', marginBottom: '4px',
                      borderLeft: '3px solid #FE2C55'
                    }}>
                      <div style={{
                        fontSize: '11px', color: '#FE2C55',
                        fontWeight: 'bold', marginBottom: '2px'
                      }}>
                        {msg.replyTo.author}
                      </div>
                      <div style={{ fontSize: '12px', color: subColor }}>
                        {msg.replyTo.text?.substring(0, 60)}
                        {msg.replyTo.text?.length > 60 ? '...' : ''}
                      </div>
                    </div>
                  )}

                  <div
                    onTouchStart={() => onMessageTouchStart(msg.id)}
                    onTouchEnd={onMessageTouchEnd}
                    onDoubleClick={() => onMessageDoubleClick(msg.id)}
                    style={{
                      maxWidth: '75%', padding: '10px 14px',
                      backgroundColor: isYou ? '#FE2C55' : (darkMode ? '#1a1a1a' : '#fff'),
                      borderRadius: isYou ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      border: isActions ? '2px solid #FE2C55' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      fontSize: '15px',
                      color: isYou ? '#fff' : color,
                      lineHeight: '1.5', wordBreak: 'break-word'
                    }}>
                      {msg.text}
                    </div>
                    <div style={{
                      fontSize: '11px', marginTop: '4px',
                      color: isYou ? 'rgba(255,255,255,0.7)' : subColor,
                      textAlign: isYou ? 'right' : 'left'
                    }}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Emoji reactions */}
                  {reactions.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                      {reactions.map(emoji => (
                        <button key={emoji} onClick={() => onAddEmojiReaction(msg.id, emoji)} style={{
                          backgroundColor: darkMode ? '#1a1a1a' : '#f0f0f0',
                          border: `1px solid ${darkMode ? '#333' : '#ddd'}`,
                          borderRadius: '12px', padding: '2px 6px',
                          fontSize: '14px', cursor: 'pointer',
                          WebkitTapHighlightColor: 'transparent'
                        }}>{emoji}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={this.messagesEndRef} />
        </div>

        {/* Message Actions Sheet */}
        {showMessageActions && (
          <div
            onClick={onCloseMessageActions}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                borderRadius: '20px 20px 0 0',
                padding: '20px'
              }}
            >
              {/* Quick emoji reactions */}
              <div style={{
                display: 'flex', justifyContent: 'center',
                gap: '12px', marginBottom: '20px'
              }}>
                {popularEmojis?.map(emoji => (
                  <button key={emoji} onClick={() => {
                    onAddEmojiReaction(currentMessageActions, emoji);
                    onCloseMessageActions();
                  }} style={{
                    fontSize: '24px', backgroundColor: 'transparent',
                    border: 'none', cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent'
                  }}>{emoji}</button>
                ))}
              </div>

              {[
                { icon: <FaReply size={18} />, label: 'Reply', action: onReplyToMessage },
                { icon: <FaCopy size={18} />, label: 'Copy', action: onCopyMessage },
                { icon: <FaForward size={18} />, label: 'Forward', action: onForwardMessage },
                { icon: <FaTrash size={18} />, label: 'Delete', action: onDeleteMessage, danger: true },
              ].map(item => (
                <button key={item.label} onClick={item.action} style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '16px', padding: '14px 0',
                  backgroundColor: 'transparent',
                  border: 'none', borderBottom: `1px solid ${border}`,
                  color: item.danger ? '#ef4444' : color,
                  fontSize: '16px', cursor: 'pointer', textAlign: 'left',
                  WebkitTapHighlightColor: 'transparent'
                }}>
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <button onClick={onCloseMessageActions} style={{
                width: '100%', padding: '14px', marginTop: '4px',
                backgroundColor: 'transparent', border: 'none',
                color: darkMode ? '#999' : '#666', fontSize: '16px',
                cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          backgroundColor: bg, borderTop: `1px solid ${border}`,
          padding: '8px 12px',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)'
        }}>
          {/* Reply Preview */}
          {replyingTo && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 12px', marginBottom: '8px',
              backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
              borderRadius: '10px', borderLeft: '3px solid #FE2C55'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#FE2C55', fontWeight: 'bold' }}>
                  Replying to {replyingTo.author}
                </div>
                <div style={{ fontSize: '13px', color: subColor }}>
                  {replyingTo.text?.substring(0, 60)}
                  {replyingTo.text?.length > 60 ? '...' : ''}
                </div>
              </div>
              <button onClick={onCancelReply} style={{
                backgroundColor: 'transparent', border: 'none',
                color: subColor, cursor: 'pointer',
                WebkitTapHighlightColor: 'transparent'
              }}>
                <FaTimes size={16} />
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <textarea
              value={newMessage}
              onChange={(e) => {
                onMessageChange(e.target.value);
                e.target.style.height = '40px';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              style={{
                flex: 1, padding: '10px 14px',
                backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                border: 'none', borderRadius: '20px',
                color, fontSize: '15px', outline: 'none',
                resize: 'none', maxHeight: '120px',
                lineHeight: '1.5', caretColor: '#FE2C55',
                fontFamily: 'inherit', overflowY: 'auto'
              }}
            />

            <button
              onClick={onSendMessage}
              disabled={!newMessage.trim()}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: newMessage.trim() ? '#FE2C55' : (darkMode ? '#333' : '#ddd'),
                border: 'none', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                transition: 'background-color 0.2s',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <FaPaperPlane size={16} color={newMessage.trim() ? 'white' : (darkMode ? '#666' : '#999')} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { currentPage } = this.props;
    if (currentPage === 'chat-detail') return this.renderChatDetail();
    return this.renderChatList();
  }
}

export default Chat;
