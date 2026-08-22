import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  UserPlus, 
  BookOpen, 
  Check
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';

export const Notifications: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    showToast 
  } = useApp();

  const handleMarkRead = (id: string) => {
    markNotificationRead(id);
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    showToast('All notifications marked as read', 'success');
  };

  const getNotifStyles = (type: string) => {
    switch (type) {
      case 'like':
        return {
          icon: <Heart className="w-4 h-4 fill-pink-500 stroke-pink-500 text-white" />,
          bgColor: 'bg-pink-50 border-pink-100',
          text: 'liked your article'
        };
      case 'comment':
        return {
          icon: <MessageSquare className="w-4 h-4 text-white fill-teal-600" />,
          bgColor: 'bg-teal-50 border-teal-100',
          text: 'responded to your article'
        };
      case 'follow':
        return {
          icon: <UserPlus className="w-4 h-4 text-white" />,
          bgColor: 'bg-blue-50 border-blue-100 bg-indigo-500', // style tweak
          text: 'started following you'
        };
      case 'publish':
        return {
          icon: <BookOpen className="w-4 h-4 text-white" />,
          bgColor: 'bg-emerald-50 border-emerald-100 bg-emerald-600',
          text: 'published a new story'
        };
      default:
        return {
          icon: <Bell className="w-4 h-4 text-zinc-550 text-zinc-500" />,
          bgColor: 'bg-zinc-50 border-zinc-150',
          text: 'notified you'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-150">
        <div>
          <h1 className="font-serif text-3xl font-bold text-zinc-950 flex items-center gap-2">
            <Bell className="w-7 h-7 text-brand-700" />
            <span>Notifications</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Stay updated with comments, follows, likes, and mentions on your stories.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 border border-zinc-200 hover:border-zinc-900 rounded-full text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors focus:outline-none bg-white"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div>
        {notifications.length === 0 ? (
          <EmptyState
            title="All quiet here"
            description="You don't have any notifications right now. We'll alert you when readers interact with your stories or follow your profile."
            icon={<Bell className="w-10 h-10 text-zinc-400" />}
          />
        ) : (
          <div className="space-y-4">
            {notifications.map(notif => {
              const styles = getNotifStyles(notif.type);
              
              // Custom follow wrapper styles
              const iconContainerBg = notif.type === 'follow' 
                ? 'bg-blue-600' 
                : notif.type === 'publish'
                ? 'bg-emerald-600'
                : styles.bgColor.split(' ')[0];

              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`border border-zinc-200 rounded-xl p-4 flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                    notif.read 
                      ? 'bg-white hover:bg-zinc-50/50' 
                      : 'bg-brand-50/20 border-brand-200/50 hover:bg-brand-50/40 shadow-sm'
                  }`}
                >
                  {/* Left Icon Badge overlay */}
                  <div className="relative">
                    <img 
                      src={notif.actorAvatar} 
                      alt={notif.actorName} 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-150"
                    />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border border-white text-[8px] flex items-center justify-center ${iconContainerBg}`}>
                      {styles.icon}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 text-xs">
                    <p className="text-zinc-800 font-sans leading-relaxed">
                      <span className="font-bold text-zinc-950">{notif.actorName}</span>{' '}
                      {styles.text}{' '}
                      {notif.articleTitle && (
                        <span className="italic font-serif text-zinc-900 font-semibold block sm:inline mt-1 sm:mt-0">
                          "{notif.articleTitle}"
                        </span>
                      )}
                    </p>
                    <span className="text-[10px] text-zinc-450 text-zinc-400 mt-1 block">
                      {notif.date}
                    </span>
                  </div>

                  {/* Unread circle */}
                  {!notif.read && (
                    <div className="w-2 h-2 bg-brand-700 rounded-full self-center flex-shrink-0" />
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
