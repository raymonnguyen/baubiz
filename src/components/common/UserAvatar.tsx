import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

interface UserAvatarProps {
  name: string;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export default function UserAvatar({ name, isOpen, onToggle, onLogout }: UserAvatarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
        aria-label="User menu"
      >
        {getInitials(name)}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 shadow-lg z-50"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{name}</p>
            </div>
            <Link
              href="/profile"
              onClick={onToggle}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Profile
            </Link>
            <Link
              href="/orders"
              onClick={onToggle}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Order History
            </Link>
            <button
              onClick={() => {
                onLogout();
                onToggle();
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
            >
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 