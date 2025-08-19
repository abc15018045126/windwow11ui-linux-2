import React, { useEffect, useRef, useState } from 'react';

export type ContextMenuItem =
  | { type: 'item'; label: string; onClick: () => void; disabled?: boolean }
  | { type: 'separator' }
  | { type: 'submenu'; label: string; items: ContextMenuItem[] };

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const subMenuRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const menuWidth = 180;
  const menuHeight = items.length * 32;

  const finalX = x + menuWidth > screenWidth ? x - menuWidth : x;
  const finalY = y + menuHeight > screenHeight ? screenHeight - menuHeight - 5 : y;

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.type === 'item' && !item.disabled) {
      item.onClick();
    }
    // Always close the entire menu stack on any action click
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{ top: finalY, left: finalX }}
      className="fixed bg-black/80 backdrop-blur-xl border border-zinc-700 rounded-md shadow-lg py-1.5 w-48 text-sm text-zinc-100 z-[60] animate-fade-in-fast"
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="h-px bg-zinc-700 my-1.5" />;
        }
        if (item.type === 'submenu') {
          const parentButton = subMenuRef.current[index];
          const parentRect = parentButton?.getBoundingClientRect();
          return (
            <button
              key={index}
              ref={el => subMenuRef.current[index] = el}
              onMouseEnter={() => setActiveSubMenu(index)}
              onMouseLeave={() => setActiveSubMenu(null)}
              className="w-full text-left px-3 py-1.5 hover:bg-blue-600 rounded-sm flex items-center justify-between"
            >
              <span>{item.label}</span>
              <span className="text-xs">&gt;</span>
              {activeSubMenu === index && parentRect && (
                <ContextMenu
                  items={item.items}
                  x={parentRect.right}
                  y={parentRect.top}
                  onClose={onClose}
                />
              )}
            </button>
          );
        }
        return (
          <button
            key={index}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
            className="w-full text-left px-3 py-1.5 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm flex items-center"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

export default ContextMenu;