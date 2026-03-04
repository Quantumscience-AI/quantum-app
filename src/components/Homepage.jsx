import React from 'react';
import {
  FaHome, FaSearch, FaBell, FaComments, FaPlus, FaBars,
  FaSun, FaMoon, FaHeart, FaRegComment, FaRetweet, FaShare,
  FaEllipsisH, FaTimes, FaUserCircle, FaArrowLeft, FaClock,
  FaLink, FaCopy, FaEdit, FaTrash, FaForward, FaWhatsapp,
  FaFacebookF, FaTelegram, FaReddit, FaEnvelope, FaSms, FaCog
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SendHorizontal } from 'lucide-react';

class Homepage extends React.Component {

  renderSideMenu() {
    const {
      darkMode, showSideMenu, isAnonymous, userProfile, anonymousProfile,
      selectedAvatarStyle, publicProfilePhotoPreview,
      onCloseSideMenu, onSwitchProfile, onOpenProfile,
      onOpenSettings, onLogout, onToggleDarkMode
    } = this.props;

    if (!showSideMenu) return null;

    const bg = darkMode ? '#111' : '#fff';
    const color = darkMode ? '#fff' : '#000';
    const subColor = darkMode ? '#999' : '#666';
    const border = darkMode ? '#222' : '#f0f0f0';

    const currentName = isAnonymous
      ? (anonymousProfile?.name || 'Anonymous')
      : (userProfile?.name || 'User');
    const currentUsername = isAnonymous
      ? (anonymousProfile?.username || 'anonymous')
      : (userProfile?.username || 'user');

    return (
      <>
        <div onClick={onCloseSideMenu} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 500
        }} />
        <div style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: '80%', maxWidth: '320px',
          backgroundColor: bg, zIndex: 501,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ padding: '48px 20px 20px', borderBottom: `1px solid ${border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <button
                onClick={() => { onOpenProfile(currentUsername); onCloseSideMenu(); }}
                style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  overflow: 'hidden', border: 'none', padding: 0,
                  cursor: 'pointer', backgroundColor: darkMode ? '#333' : '#eee',
                  WebkitTapHighlightColor: 'transparent', flexShrink: 0
                }}
              >
                {isAnonymous ? (
                  <img
                    src={`https://api.dicebear.com/7.x/${selectedAvatarStyle || 'adventurer'}/svg?seed=${currentUsername}`}
                    alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : publicProfilePhotoPreview ? (
                  <img src={publicProfilePhotoPreview} alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <FaUserCircle size={60} color={darkMode ? '#666' : '#999'} />
                )}
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px', color, marginBottom: '2px' }}>
                  {currentName}
                </div>
                <div style={{ fontSize: '13px', color: subColor }}>@{currentUsername}</div>
                {isAnonymous && (
                  <div style={{
                    display: 'inline-block', marginTop: '4px',
                    padding: '2px 8px', backgroundColor: '#FE2C55',
                    borderRadius: '10px', fontSize: '11px', color: 'white', fontWeight: '600'
                  }}>Anonymous</div>
                )}
              </div>
            </div>
            <button onClick={onSwitchProfile} style={{
              width: '100%', padding: '10px 14px',
              backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
              border: `1px solid ${border}`, borderRadius: '10px',
              color, fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: '8px',
              WebkitTapHighlightColor: 'transparent'
            }}>
              <span>Switch to {isAnonymous ? 'Public' : 'Anonymous'}</span>
            </button>
          </div>

          <div style={{ flex: 1, padding: '12px 0' }}>
            {[
              { icon: <FaUserCircle size={20} />, label: 'Profile', action: () => { onOpenProfile(currentUsername); onCloseSideMenu(); } },
              { icon: <FaCog size={20} />, label: 'Settings', action: () => { onOpenSettings(); onCloseSideMenu(); } },
              { icon: darkMode ? <FaSun size={20} /> : <FaMoon size={20} />, label: darkMode ? 'Light Mode' : 'Dark Mode', action: onToggleDarkMode },
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '16px', padding: '14px 20px',
                backgroundColor: 'transparent', border: 'none',
                color, fontSize: '16px', cursor: 'pointer',
                textAlign: 'left', WebkitTapHighlightColor: 'transparent'
              }}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: '12px 0', borderTop: `1px solid ${border}` }}>
            <button onClick={() => { onLogout(); onCloseSideMenu(); }} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '16px', padding: '14px 20px',
              backgroundColor: 'transparent', border: 'none',
              color: '#ef4444', fontSize: '16px', cursor: 'pointer',
              textAlign: 'left', WebkitTapHighlightColor: 'transparent'
            }}>
              <FaArrowLeft size={20} /><span>Log Out</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  renderHeader() {
    const { darkMode, feedTab, onFeedTabChange, onToggleSideMenu, onToggleDarkMode } = this.props;
    const color = darkMode ? '#fff' : '#000';
    const inactive = darkMode ? '#666' : '#999';
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        backgroundColor: darkMode ? '#000' : '#fff',
        borderBottom: `1px solid ${darkMode ? '#222' : '#f0f0f0'}`,
        zIndex: 100, padding: '12px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <button onClick={onToggleSideMenu} style={{
            backgroundColor: 'transparent', border: 'none',
            color, cursor: 'pointer', padding: '4px',
            WebkitTapHighlightColor: 'transparent'
          }}><FaBars size={22} /></button>
          <div style={{
            fontSize: '22px', fontWeight: 'bold',
            background: 'linear-gradient(135deg, #FE2C55, #FF6B9D)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Digit</div>
          <button onClick={onToggleDarkMode} style={{
            backgroundColor: 'transparent', border: 'none',
            color, cursor: 'pointer', padding: '4px',
            WebkitTapHighlightColor: 'transparent'
          }}>
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
        <div style={{ display: 'flex' }}>
          {['foryou', 'trending'].map(tab => (
            <button key={tab} onClick={() => onFeedTabChange(tab)} style={{
              flex: 1, padding: '8px',
              backgroundColor: 'transparent', border: 'none',
              borderBottom: `2px solid ${feedTab === tab ? '#FE2C55' : 'transparent'}`,
              color: feedTab === tab ? '#FE2C55' : inactive,
              fontSize: '15px', fontWeight: feedTab === tab ? 'bold' : 'normal',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              transition: 'all 0.2s'
            }}>
              {tab === 'foryou' ? 'For You' : 'Trending'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  renderNavBar() {
    const { darkMode, activeTab, unreadNotifCount, onTabChange } = this.props;
    const inactive = darkMode ? '#666' : '#999';
    const tabs = [
      { id: 'home', icon: <FaHome size={22} /> },
      { id: 'search', icon: <FaSearch size={22} /> },
      { id: 'create', icon: <FaPlus size={22} /> },
      { id: 'notifications', icon: <FaBell size={22} /> },
      { id: 'chats', icon: <FaComments size={22} /> },
    ];
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: darkMode ? '#000' : '#fff',
        borderTop: `1px solid ${darkMode ? '#222' : '#f0f0f0'}`,
        display: 'flex', alignItems: 'center',
        padding: '8px 0', zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 8px)'
      }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'transparent', border: 'none',
            color: activeTab === tab.id ? '#FE2C55' : inactive,
            cursor: 'pointer', padding: '8px', position: 'relative',
            WebkitTapHighlightColor: 'transparent'
          }}>
            {tab.id === 'create' ? (
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                backgroundColor: '#FE2C55',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(254,44,85,0.3)'
              }}>
                <FaPlus size={20} color="white" />
              </div>
            ) : tab.icon}
            {tab.id === 'notifications' && unreadNotifCount > 0 && (
              <div style={{
                position: 'absolute', top: '4px', right: 'calc(50% - 18px)',
                backgroundColor: '#FE2C55', borderRadius: '10px',
                minWidth: '18px', height: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 'bold', color: 'white', padding: '0 4px'
              }}>
                {unreadNotifCount > 99 ? '99+' : unreadNotifCount}
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  renderCreatePage() {
    const {
      darkMode, newOpinion, postTitle, postAsPublic,
      selectedVibes, showVibeModal, expiryDays, showExpiryOptions,
      showPollOptions, pollOptions, isLoading, vibes,
      userProfile, anonymousProfile, selectedAvatarStyle, publicProfilePhotoPreview,
      onOpinionChange, onTitleChange, onTogglePostProfile, onToggleVibeModal,
      onToggleVibe, onToggleExpiryOptions, onSetExpiryDays,
      onTogglePollOptions, onUpdatePollOption, onAddPollOption,
      onRemovePollOption, onSubmitPost, onCancelCreate
    } = this.props;

    const color = darkMode ? '#fff' : '#000';
    const subColor = darkMode ? '#999' : '#666';
    const border = darkMode ? '#222' : '#f0f0f0';
    const inputBg = darkMode ? '#1a1a1a' : '#f5f5f5';
    const currentName = postAsPublic ? (userProfile?.name || 'User') : (anonymousProfile?.name || 'Anonymous');
    const currentUsername = postAsPublic ? (userProfile?.username || 'user') : (anonymousProfile?.username || 'anonymous');
    const expiryOptions = [
      { label: '1 day', value: 1 }, { label: '3 days', value: 3 },
      { label: '6 days', value: 6 }, { label: '2 weeks', value: 14 },
      { label: '1 month', value: 30 },
    ];

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: darkMode ? '#000' : '#fff',
        zIndex: 200, display: 'flex', flexDirection: 'column',
        fontFamily: "'Noto Sans', system-ui, sans-serif"
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px', borderBottom: `1px solid ${border}`
        }}>
          <button onClick={onCancelCreate} style={{
            backgroundColor: 'transparent', border: 'none',
            color, cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
          }}><FaTimes size={22} /></button>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color, margin: 0 }}>Create Post</h2>
          <button onClick={onSubmitPost} disabled={!newOpinion.trim() || isLoading} style={{
            padding: '8px 20px',
            backgroundColor: newOpinion.trim() && !isLoading ? '#FE2C55' : '#999',
            border: 'none', borderRadius: '20px', color: 'white',
            fontSize: '14px', fontWeight: 'bold',
            cursor: newOpinion.trim() && !isLoading ? 'pointer' : 'not-allowed',
            WebkitTapHighlightColor: 'transparent'
          }}>
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <button onClick={onTogglePostProfile} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', marginBottom: '16px',
            backgroundColor: inputBg, border: `1px solid ${border}`,
            borderRadius: '10px', cursor: 'pointer', width: '100%',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              overflow: 'hidden', backgroundColor: darkMode ? '#333' : '#ddd', flexShrink: 0
            }}>
              {postAsPublic ? (
                publicProfilePhotoPreview
                  ? <img src={publicProfilePhotoPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <FaUserCircle size={32} color={darkMode ? '#666' : '#999'} />
              ) : (
                <img src={`https://api.dicebear.com/7.x/${selectedAvatarStyle || 'adventurer'}/svg?seed=${currentUsername}`}
                  alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color }}>{currentName}</div>
              <div style={{ fontSize: '12px', color: subColor }}>
                Posting as {postAsPublic ? 'public' : 'anonymous'} · tap to switch
              </div>
            </div>
          </button>

          <input type="text" value={postTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Title (optional)"
            style={{
              width: '100%', padding: '12px 0',
              backgroundColor: 'transparent', border: 'none',
              borderBottom: `1px solid ${border}`,
              color, fontSize: '18px', fontWeight: 'bold',
              outline: 'none', marginBottom: '12px',
              boxSizing: 'border-box', caretColor: '#FE2C55', fontFamily: 'inherit'
            }}
          />

          <textarea value={newOpinion}
            onChange={(e) => {
              onOpinionChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            placeholder="What's on your mind?"
            rows={4}
            style={{
              width: '100%', padding: '0',
              backgroundColor: 'transparent', border: 'none',
              color, fontSize: '16px', outline: 'none',
              resize: 'none', lineHeight: '1.6',
              caretColor: '#FE2C55', fontFamily: 'inherit',
              boxSizing: 'border-box', minHeight: '120px'
            }}
          />

          {showPollOptions && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color, marginBottom: '8px' }}>Poll Options</div>
              {pollOptions.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input type="text" value={opt}
                    onChange={(e) => onUpdatePollOption(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                    style={{
                      flex: 1, padding: '10px 14px', backgroundColor: inputBg,
                      border: `1px solid ${border}`, borderRadius: '8px',
                      color, fontSize: '14px', outline: 'none',
                      caretColor: '#FE2C55', fontFamily: 'inherit'
                    }}
                  />
                  {pollOptions.length > 2 && (
                    <button onClick={() => onRemovePollOption(i)} style={{
                      backgroundColor: 'transparent', border: 'none',
                      color: '#ef4444', cursor: 'pointer', padding: '8px',
                      WebkitTapHighlightColor: 'transparent'
                    }}><FaTimes size={16} /></button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button onClick={onAddPollOption} style={{
                  padding: '8px 16px', backgroundColor: 'transparent',
                  border: `1px dashed ${border}`, borderRadius: '8px',
                  color: '#FE2C55', fontSize: '14px', fontWeight: '600',
                  cursor: 'pointer', WebkitTapHighlightColor: 'transparent', width: '100%'
                }}>+ Add Option</button>
              )}
            </div>
          )}

          {selectedVibes.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {selectedVibes.map(vibe => (
                <span key={vibe} onClick={() => onToggleVibe(vibe)} style={{
                  padding: '4px 10px', backgroundColor: '#FE2C55',
                  borderRadius: '20px', fontSize: '12px', color: 'white',
                  fontWeight: '600', cursor: 'pointer'
                }}>#{vibe} ×</span>
              ))}
            </div>
          )}
        </div>

        <div style={{
          borderTop: `1px solid ${border}`, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: '16px', position: 'relative',
          paddingBottom: 'env(safe-area-inset-bottom, 12px)'
        }}>
          <button onClick={onToggleVibeModal} style={{
            backgroundColor: 'transparent', border: 'none',
            color: selectedVibes.length > 0 ? '#FE2C55' : subColor,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '13px', fontWeight: '600', WebkitTapHighlightColor: 'transparent'
          }}>
            <span style={{ fontSize: '16px' }}>🎯</span>
            <span>Vibes{selectedVibes.length > 0 ? ` (${selectedVibes.length})` : ''}</span>
          </button>
          <button onClick={onTogglePollOptions} style={{
            backgroundColor: 'transparent', border: 'none',
            color: showPollOptions ? '#FE2C55' : subColor,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '13px', fontWeight: '600', WebkitTapHighlightColor: 'transparent'
          }}>
            <span style={{ fontSize: '16px' }}>📊</span><span>Poll</span>
          </button>
          <button onClick={onToggleExpiryOptions} style={{
            backgroundColor: 'transparent', border: 'none',
            color: subColor, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '4px',
            fontSize: '13px', fontWeight: '600', WebkitTapHighlightColor: 'transparent'
          }}>
            <FaClock size={14} />
            <span>{expiryOptions.find(o => o.value === expiryDays)?.label || '6 days'}</span>
          </button>
          {showExpiryOptions && (
            <div style={{
              position: 'absolute', bottom: '70px', left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: darkMode ? '#1a1a1a' : '#fff',
              border: `1px solid ${border}`, borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              zIndex: 300, minWidth: '160px'
            }}>
              {expiryOptions.map(opt => (
                <button key={opt.value} onClick={() => onSetExpiryDays(opt.value)} style={{
                  width: '100%', padding: '12px 16px',
                  backgroundColor: expiryDays === opt.value ? '#FE2C55' : 'transparent',
                  border: 'none', color: expiryDays === opt.value ? 'white' : color,
                  fontSize: '14px', cursor: 'pointer', textAlign: 'left',
                  WebkitTapHighlightColor: 'transparent'
                }}>{opt.label}</button>
              ))}
            </div>
          )}
        </div>

        {showVibeModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 400,
            display: 'flex', alignItems: 'flex-end'
          }}>
            <div style={{
              width: '100%', backgroundColor: darkMode ? '#1a1a1a' : '#fff',
              borderRadius: '20px 20px 0 0', padding: '20px',
              maxHeight: '70vh', overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color, margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Select Vibes</h3>
                <button onClick={onToggleVibeModal} style={{
                  backgroundColor: 'transparent', border: 'none',
                  color, cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
                }}><FaTimes size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {vibes.map(vibe => (
                  <button key={vibe} onClick={() => onToggleVibe(vibe)} style={{
                    padding: '8px 14px',
                    backgroundColor: selectedVibes.includes(vibe) ? '#FE2C55' : (darkMode ? '#333' : '#f0f0f0'),
                    border: 'none', borderRadius: '20px',
                    color: selectedVibes.includes(vibe) ? 'white' : color,
                    fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
                  }}>#{vibe}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  renderPost(post) {
    const {
      darkMode, expandedPosts, loveBubbles,
      onLike, onComment, onRepost, onShare, onPostActions,
      onOpenProfile, onToggleExpanded, onVote
    } = this.props;

    const isExpanded = expandedPosts[post.id];
    const textLimit = 200;
    const needsTruncation = post.text && post.text.length > textLimit;
    const displayText = needsTruncation && !isExpanded
      ? post.text.substring(0, textLimit) + '...'
      : post.text;

    const color = darkMode ? '#fff' : '#000';
    const subColor = darkMode ? '#999' : '#666';
    const border = darkMode ? '#222' : '#f0f0f0';
    const postBubbles = (loveBubbles || []).filter(b => b.postId === post.id);

    return (
      <div key={post.id} style={{
        backgroundColor: darkMode ? '#000' : '#fff',
        borderBottom: `1px solid ${border}`,
        padding: '16px', position: 'relative',
        fontFamily: "'Noto Sans', system-ui, sans-serif"
      }}>
        {postBubbles.map(bubble => (
          <div key={bubble.id} style={{
            position: 'absolute', left: `${bubble.left}%`,
            bottom: '60px', fontSize: '20px',
            animation: 'floatUp 1.5s ease forwards',
            pointerEvents: 'none', zIndex: 10
          }}>❤️</div>
        ))}

        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px' }}>
          <button onClick={() => onOpenProfile(post.username)} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            overflow: 'hidden', flexShrink: 0, marginRight: '12px',
            border: 'none', padding: 0, cursor: 'pointer',
            backgroundColor: darkMode ? '#222' : '#f0f0f0',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <img
              src={post.is_anonymous
                ? `https://api.dicebear.com/7.x/${post.avatar_style || 'adventurer'}/svg?seed=${post.username}`
                : (post.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.username}`)
              }
              alt={post.username}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <button onClick={() => onOpenProfile(post.username)} style={{
                  backgroundColor: 'transparent', border: 'none',
                  color, fontWeight: 'bold', fontSize: '15px',
                  cursor: 'pointer', padding: 0,
                  WebkitTapHighlightColor: 'transparent'
                }}>
                  {post.display_name || post.username}
                </button>
                <div style={{ fontSize: '13px', color: subColor }}>
                  @{post.username} · {post.timestamp}
                </div>
              </div>
              <button onClick={() => onPostActions(post.id)} style={{
                backgroundColor: 'transparent', border: 'none',
                color: subColor, cursor: 'pointer', padding: '4px',
                WebkitTapHighlightColor: 'transparent'
              }}><FaEllipsisH size={16} /></button>
            </div>
          </div>
        </div>

        {post.title && (
          <div style={{
            fontSize: '17px', fontWeight: 'bold',
            color, marginBottom: '8px', lineHeight: '1.4'
          }}>{post.title}</div>
        )}

        <div style={{
          fontSize: '15px', color, lineHeight: '1.6',
          marginBottom: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
        }}>
          {displayText}
          {needsTruncation && (
            <button onClick={() => onToggleExpanded(post.id)} style={{
              backgroundColor: 'transparent', border: 'none',
              color: '#FE2C55', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', padding: '0 4px',
              WebkitTapHighlightColor: 'transparent'
            }}>
              {isExpanded ? ' Show less' : ' Show more'}
            </button>
          )}
        </div>

        {post.poll && this.renderPoll(post)}

        {post.vibes && post.vibes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {post.vibes.map(vibe => (
              <span key={vibe} style={{
                padding: '4px 10px',
                backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                borderRadius: '20px', fontSize: '12px',
                color: '#FE2C55', fontWeight: '600'
              }}>#{vibe}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => onLike(post.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: 'transparent', border: 'none',
            color: post.liked ? '#FE2C55' : subColor,
            cursor: 'pointer', padding: '8px', fontSize: '14px', fontWeight: '500',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <FaHeart size={18} color={post.liked ? '#FE2C55' : subColor} />
            <span>{post.likes || 0}</span>
          </button>
          <button onClick={() => onComment(post.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: 'transparent', border: 'none',
            color: subColor, cursor: 'pointer', padding: '8px', fontSize: '14px', fontWeight: '500',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <FaRegComment size={18} /><span>{post.comments || 0}</span>
          </button>
          <button onClick={() => onRepost(post.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: 'transparent', border: 'none',
            color: post.reposted ? '#22c55e' : subColor,
            cursor: 'pointer', padding: '8px', fontSize: '14px', fontWeight: '500',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <FaRetweet size={18} /><span>{post.reposts || 0}</span>
          </button>
          <button onClick={() => onShare(post.id)} style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            backgroundColor: 'transparent', border: 'none',
            color: subColor, cursor: 'pointer', padding: '8px', fontSize: '14px', fontWeight: '500',
            WebkitTapHighlightColor: 'transparent'
          }}><FaShare size={18} /></button>
        </div>

        <style>{`
          @keyframes floatUp {
            0% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-80px); }
          }
        `}</style>
      </div>
    );
  }

  renderPoll(post) {
    const { darkMode, onVote } = this.props;
    const poll = post.poll;
    if (!poll) return null;
    const totalVotes = poll.options?.reduce((sum, opt) => sum + (opt.votes || 0), 0) || 0;
    return (
      <div style={{ marginBottom: '12px' }}>
        {poll.options?.map(option => {
          const pct = totalVotes > 0 ? Math.round((option.votes || 0) / totalVotes * 100) : 0;
          const isSelected = post.selectedOption === option.id;
          return (
            <button key={option.id} onClick={() => !post.voted && onVote(post.id, option.id)} style={{
              width: '100%', padding: '12px 16px', marginBottom: '8px',
              borderRadius: '10px',
              border: `2px solid ${isSelected ? '#FE2C55' : (darkMode ? '#333' : '#e0e0e0')}`,
              backgroundColor: 'transparent',
              cursor: post.voted ? 'default' : 'pointer',
              position: 'relative', overflow: 'hidden',
              textAlign: 'left', WebkitTapHighlightColor: 'transparent'
            }}>
              {post.voted && (
                <div style={{
                  position: 'absolute', top: 0, left: 0,
                  width: `${pct}%`, height: '100%',
                  backgroundColor: isSelected
                    ? 'rgba(254,44,85,0.15)'
                    : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  transition: 'width 0.5s ease'
                }} />
              )}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', position: 'relative', zIndex: 1
              }}>
                <span style={{
                  fontSize: '14px',
                  color: isSelected ? '#FE2C55' : (darkMode ? '#fff' : '#000'),
                  fontWeight: isSelected ? '600' : 'normal'
                }}>{option.text}</span>
                {post.voted && (
                  <span style={{
                    fontSize: '13px', fontWeight: 'bold',
                    color: isSelected ? '#FE2C55' : (darkMode ? '#999' : '#666')
                  }}>{pct}%</span>
                )}
              </div>
            </button>
          );
        })}
        <div style={{ fontSize: '13px', color: darkMode ? '#666' : '#999', marginTop: '4px' }}>
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }

  renderRepostSheet() {
    const { darkMode, showRepostSheet, onRepostAction, onCloseRepostSheet } = this.props;
    if (!showRepostSheet) return null;
    const color = darkMode ? '#fff' : '#000';
    const border = darkMode ? '#222' : '#f0f0f0';
    return (
      <div onClick={onCloseRepostSheet} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300,
        display: 'flex', alignItems: 'flex-end'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          width: '100%', backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          borderRadius: '20px 20px 0 0', padding: '20px'
        }}>
          <h3 style={{ color, margin: '0 0 16px 0', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
            Repost
          </h3>
          {[
            { icon: <FaRetweet size={20} />, label: 'Repost', action: () => onRepostAction('repost') },
            { icon: <FaEdit size={20} />, label: 'Quote Post', action: () => onRepostAction('quote') },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '16px', padding: '14px 0',
              backgroundColor: 'transparent', border: 'none',
              borderBottom: `1px solid ${border}`,
              color, fontSize: '16px', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent'
            }}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
          <button onClick={onCloseRepostSheet} style={{
            width: '100%', padding: '14px', marginTop: '8px',
            backgroundColor: 'transparent', border: 'none',
            color: '#ef4444', fontSize: '16px', fontWeight: '600',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  renderPostActionsSheet() {
    const { darkMode, showPostActions, onCopyPostLink, onForwardPost, onDeletePost, onClosePostActions } = this.props;
    if (!showPostActions) return null;
    const color = darkMode ? '#fff' : '#000';
    const border = darkMode ? '#222' : '#f0f0f0';
    return (
      <div onClick={onClosePostActions} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300,
        display: 'flex', alignItems: 'flex-end'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          width: '100%', backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          borderRadius: '20px 20px 0 0', padding: '20px'
        }}>
          {[
            { icon: <FaLink size={18} />, label: 'Copy Link', action: onCopyPostLink },
            { icon: <FaForward size={18} />, label: 'Forward', action: onForwardPost },
            { icon: <FaTrash size={18} />, label: 'Delete Post', action: onDeletePost, danger: true },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '16px', padding: '14px 0',
              backgroundColor: 'transparent', border: 'none',
              borderBottom: `1px solid ${border}`,
              color: item.danger ? '#ef4444' : color,
              fontSize: '16px', cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent'
            }}>
              {item.icon}<span>{item.label}</span>
            </button>
          ))}
          <button onClick={onClosePostActions} style={{
            width: '100%', padding: '14px', marginTop: '8px',
            backgroundColor: 'transparent', border: 'none',
            color: darkMode ? '#999' : '#666', fontSize: '16px',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  renderShareModal() {
    const { darkMode, showShareModal, onShareToApp, onCloseShareModal } = this.props;
    if (!showShareModal) return null;
    const color = darkMode ? '#fff' : '#000';
    const shareApps = [
      { id: 'whatsapp', icon: <FaWhatsapp size={28} color="#25D366" />, label: 'WhatsApp' },
      { id: 'x', icon: <FaXTwitter size={28} color={darkMode ? '#fff' : '#000'} />, label: 'X' },
      { id: 'facebook', icon: <FaFacebookF size={28} color="#1877F2" />, label: 'Facebook' },
      { id: 'telegram', icon: <FaTelegram size={28} color="#0088CC" />, label: 'Telegram' },
      { id: 'reddit', icon: <FaReddit size={28} color="#FF4500" />, label: 'Reddit' },
      { id: 'email', icon: <FaEnvelope size={28} color="#EA4335" />, label: 'Email' },
      { id: 'messages', icon: <FaSms size={28} color="#34C759" />, label: 'Messages' },
      { id: 'copy', icon: <FaCopy size={28} color="#FE2C55" />, label: 'Copy Link' },
    ];
    return (
      <div onClick={onCloseShareModal} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 300,
        display: 'flex', alignItems: 'flex-end'
      }}>
        <div onClick={e => e.stopPropagation()} style={{
          width: '100%', backgroundColor: darkMode ? '#1a1a1a' : '#fff',
          borderRadius: '20px 20px 0 0', padding: '20px'
        }}>
          <h3 style={{ color, margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
            Share Post
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
            {shareApps.map(app => (
              <button key={app.id} onClick={() => onShareToApp(app.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                backgroundColor: 'transparent', border: 'none',
                cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
              }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  backgroundColor: darkMode ? '#333' : '#f0f0f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>{app.icon}</div>
                <span style={{ fontSize: '12px', color: darkMode ? '#999' : '#666' }}>{app.label}</span>
              </button>
            ))}
          </div>
          <button onClick={onCloseShareModal} style={{
            width: '100%', padding: '14px',
            backgroundColor: 'transparent', border: 'none',
            color: darkMode ? '#999' : '#666', fontSize: '16px',
            cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
          }}>Cancel</button>
        </div>
      </div>
    );
  }

  renderCommentsModal() {
    const {
      darkMode, showComments, currentPostComments, commentText,
      commentAsPublic, isLoadingComments, expandedComments,
      userProfile, anonymousProfile, selectedAvatarStyle, publicProfilePhotoPreview,
      onCloseComments, onCommentTextChange, onToggleCommentProfile,
      onAddComment, onCommentLike, onToggleCommentExpanded,
      onCommentLongPress, commentDeleteConfirm
    } = this.props;

    if (!showComments) return null;
    const color = darkMode ? '#fff' : '#000';
    const subColor = darkMode ? '#999' : '#666';
    const border = darkMode ? '#222' : '#f0f0f0';
    const currentUsername = commentAsPublic
      ? (userProfile?.username || 'user')
      : (anonymousProfile?.username || 'anonymous');

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: darkMode ? '#000' : '#fff',
        zIndex: 250, display: 'flex', flexDirection: 'column',
        fontFamily: "'Noto Sans', system-ui, sans-serif"
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px', borderBottom: `1px solid ${border}`
        }}>
          <button onClick={onCloseComments} style={{
            backgroundColor: 'transparent', border: 'none',
            color, cursor: 'pointer', WebkitTapHighlightColor: 'transparent'
          }}><FaArrowLeft size={20} /></button>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color, margin: 0 }}>Comments</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {isLoadingComments ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                border: '3px solid #FE2C55', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite'
              }} />
            </div>
          ) : currentPostComments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: subColor }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
              <p>No comments yet. Be the first!</p>
            </div>
          ) : (
            currentPostComments.map(comment => {
              const isExp = expandedComments[comment.id];
              const lim = 150;
              const needsTrunc = comment.text && comment.text.length > lim;
              const displayText = needsTrunc && !isExp
                ? comment.text.substring(0, lim) + '...'
                : comment.text;
              return (
                <div key={comment.id}
                  onTouchStart={() => {
                    this._longPressTimer = setTimeout(() => onCommentLongPress(comment.id, comment.username), 600);
                  }}
                  onTouchEnd={() => { if (this._longPressTimer) clearTimeout(this._longPressTimer); }}
                  style={{
                    display: 'flex', gap: '10px', marginBottom: '16px',
                    padding: '12px', borderRadius: '12px',
                    backgroundColor: darkMode ? '#111' : '#f8f8f8'
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    overflow: 'hidden', flexShrink: 0,
                    backgroundColor: darkMode ? '#222' : '#eee'
                  }}>
                    <img
                      src={comment.is_anonymous
                        ? `https://api.dicebear.com/7.x/${comment.avatar_style || 'adventurer'}/svg?seed=${comment.username}`
                        : (comment.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${comment.username}`)
                      }
                      alt={comment.username}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '14px', color }}>
                        {comment.author || comment.username}
                      </span>
                      <span style={{ fontSize: '12px', color: subColor }}>{comment.timestamp}</span>
                    </div>
                    <div style={{ fontSize: '14px', color, lineHeight: '1.5', marginBottom: '8px' }}>
                      {displayText}
                      {needsTrunc && (
                        <button onClick={() => onToggleCommentExpanded(comment.id)} style={{
                          backgroundColor: 'transparent', border: 'none',
                          color: '#FE2C55', fontSize: '13px', fontWeight: '600',
                          cursor: 'pointer', padding: '0 4px',
                          WebkitTapHighlightColor: 'transparent'
                        }}>
                          {isExp ? ' Show less' : ' Show more'}
                        </button>
                      )}
                    </div>
                    <button onClick={() => onCommentLike(comment.id)} style={{
                      display: 'flex', alignItems: 'center', gap: '4px',
                      backgroundColor: 'transparent', border: 'none',
                      color: comment.liked ? '#FE2C55' : subColor,
                      cursor: 'pointer', fontSize: '13px',
                      WebkitTapHighlightColor: 'transparent'
                    }}>
                      <FaHeart size={14} color={comment.liked ? '#FE2C55' : subColor} />
                      <span>{comment.likes || 0}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{
          borderTop: `1px solid ${border}`, padding: '12px 16px',
          paddingBottom: 'env(safe-area-inset-bottom, 12px)'
        }}>
          <button onClick={onToggleCommentProfile} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            backgroundColor: 'transparent', border: 'none',
            color: '#FE2C55', fontSize: '12px', fontWeight: '600',
            cursor: 'pointer', marginBottom: '8px',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '50%',
              overflow: 'hidden', backgroundColor: darkMode ? '#333' : '#eee'
            }}>
              {commentAsPublic ? (
                publicProfilePhotoPreview
                  ? <img src={publicProfilePhotoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <FaUserCircle size={20} color={darkMode ? '#666' : '#999'} />
              ) : (
                <img src={`https://api.dicebear.com/7.x/${selectedAvatarStyle || 'adventurer'}/svg?seed=${currentUsername}`}
                  alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <span>@{currentUsername} · tap to switch</span>
          </button>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea value={commentText}
              onChange={(e) => {
                onCommentTextChange(e.target.value);
                e.target.style.height = '40px';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
              }}
              placeholder="Write a comment..."
              rows={1}
              style={{
                flex: 1, padding: '10px 14px',
                backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
                border: 'none', borderRadius: '20px',
                color, fontSize: '14px', outline: 'none',
                resize: 'none', maxHeight: '100px',
                lineHeight: '1.5', caretColor: '#FE2C55',
                fontFamily: 'inherit', overflowY: 'auto'
              }}
            />
            <button onClick={onAddComment} disabled={!commentText.trim()} style={{
              width: '38px', height: '38px', borderRadius: '50%',
              backgroundColor: commentText.trim() ? '#FE2C55' : (darkMode ? '#333' : '#ddd'),
              border: 'none', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: commentText.trim() ? 'pointer' : 'not-allowed',
              WebkitTapHighlightColor: 'transparent'
            }}>
              <SendHorizontal size={16} color={commentText.trim() ? 'white' : (darkMode ? '#666' : '#999')} />
            </button>
          </div>
        </div>

        {commentDeleteConfirm && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10003,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
          }}>
            <div style={{
              backgroundColor: darkMode ? '#1a1a1a' : 'white',
              borderRadius: '12px', padding: '24px', maxWidth: '400px', width: '100%'
            }}>
              <div style={{ fontSize: '16px', color, marginBottom: '24px', lineHeight: '1.5' }}>
                {commentDeleteConfirm.message}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button onClick={commentDeleteConfirm.onCancel} style={{
                  padding: '10px 20px', backgroundColor: darkMode ? '#333' : '#f0f0f0',
                  border: 'none', borderRadius: '8px', color,
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}>Cancel</button>
                <button onClick={commentDeleteConfirm.onConfirm} style={{
                  padding: '10px 20px', backgroundColor: '#ef4444',
                  border: 'none', borderRadius: '8px', color: 'white',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent'
                }}>Delete</button>
              </div>
            </div>
          </div>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  render() {
    const {
      darkMode, posts, isLoadingPosts, showCreatePage,
      showComments, showRepostSheet, showPostActions, showShareModal
    } = this.props;

    return (
      <div style={{
        minHeight: '100vh', backgroundColor: darkMode ? '#000' : '#f8f8f8',
        fontFamily: "'Noto Sans', system-ui, sans-serif"
      }}>
        {this.renderSideMenu()}
        {this.renderHeader()}

        <div style={{ paddingTop: '110px', paddingBottom: '70px' }}>
          {isLoadingPosts ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                border: '3px solid #FE2C55', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map(post => this.renderPost(post))
          ) : (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '60px 20px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: darkMode ? '#fff' : '#000', marginBottom: '8px' }}>
                No posts yet
              </h3>
              <p style={{ fontSize: '15px', color: darkMode ? '#666' : '#999' }}>
                Be the first to share something!
              </p>
            </div>
          )}
        </div>

        {this.renderNavBar()}
        {showCreatePage && this.renderCreatePage()}
        {showComments && this.renderCommentsModal()}
        {showRepostSheet && this.renderRepostSheet()}
        {showPostActions && this.renderPostActionsSheet()}
        {showShareModal && this.renderShareModal()}
      </div>
    );
  }
}

export default Homepage;
