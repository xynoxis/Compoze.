import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  BookOpen, 
  Check,
  Trash2
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const Notifications: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    clearAllNotifications,
    showToast 
  } = useApp();

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    showToast('All notifications marked as read', 'success');
  };

  const handleClearAll = () => {
    clearAllNotifications();
    showToast('Cleared all notifications', 'success');
  };

  const getNotifStyles = (type: string) => {
    switch (type) {
      case 'like':
        return {
          icon: <Heart className="w-3.5 h-3.5 fill-pink-500 stroke-pink-500 text-white" />,
          bgColor: 'bg-pink-500',
          text: 'liked your article'
        };
      case 'comment':
        return {
          icon: <MessageSquare className="w-3.5 h-3.5 text-white fill-primary" />,
          bgColor: 'bg-primary',
          text: 'responded to your article'
        };
      case 'follow':
        return {
          icon: <UserPlus className="w-3.5 h-3.5 text-white" />,
          bgColor: 'bg-blue-600',
          text: 'started following you'
        };
      case 'publish':
        return {
          icon: <BookOpen className="w-3.5 h-3.5 text-white" />,
          bgColor: 'bg-emerald-600',
          text: 'published a new story'
        };
      default:
        return {
          icon: <Bell className="w-3.5 h-3.5 text-white" />,
          bgColor: 'bg-primary',
          text: 'notified you'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border-subtle/30">
        <div>
          <h1 className="font-serif text-3xl font-bold text-on-surface flex items-center gap-2">
            <Bell className="w-7 h-7 text-primary" />
            <span>Notifications</span>
          </h1>
          <p className="text-sm text-on-surface-variant font-sans mt-1">
            Stay updated with comments, follows, likes, and mentions on your stories.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 depth-level-1 rounded-full text-xs font-semibold text-on-surface hover:text-primary ctrl-transition cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 depth-level-1 rounded-full text-xs font-semibold text-on-surface-variant hover:text-red-600 ctrl-transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications list */}
      <div>
        {notifications.length === 0 ? (
          <EmptyState
            title="All quiet here"
            description="You don't have any notifications right now. We'll alert you when readers interact with your stories or follow your profile."
            icon={<Bell className="w-10 h-10 text-on-surface-variant" />}
          />
        ) : (
          <div className="space-y-4">
            {notifications.map(notif => {
              const styles = getNotifStyles(notif.type);

              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`depth-card-interactive rounded-2xl p-4 flex items-start gap-4 ctrl-transition cursor-pointer ${
                    notif.read ? 'opacity-85' : 'border-l-4 border-l-primary'
                  }`}
                >
                  {/* Left Icon Badge overlay */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={notif.actorAvatar} 
                      alt={notif.actorName} 
                      className="w-10 h-10 rounded-full object-cover border border-border-subtle/30"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white shadow-sm flex items-center justify-center ${styles.bgColor}`}>
                      {styles.icon}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 text-xs">
                    <p className="text-on-surface font-sans leading-relaxed">
                      <span className="font-bold text-on-surface">{notif.actorName}</span>{' '}
                      {styles.text}{' '}
                      {notif.articleTitle && (
                        <span className="italic font-serif text-on-surface font-semibold block sm:inline mt-1 sm:mt-0">
                          "{notif.articleTitle}"
                        </span>
                      )}
                    </p>
                    <span className="text-[10px] text-on-surface-variant/70 mt-1 block font-sans">
                      {notif.date}
                    </span>
                  </div>

                  {/* Unread circle indicator */}
                  {!notif.read && (
                    <div className="w-2 h-2 bg-primary rounded-full self-center flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
