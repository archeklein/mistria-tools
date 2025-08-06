import React from "react";

interface ItemButtonProps {
  icon?: string | React.ReactNode;
  label: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  isSelectedByOthers?: boolean;
  isMuted?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRightClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
  width?: string;
  height?: string;
}

const ItemButton: React.FC<ItemButtonProps> = ({
  icon,
  label,
  isSelected = false,
  isDisabled = false,
  isSelectedByOthers = false,
  isMuted = false,
  onClick,
  onDoubleClick,
  onRightClick,
  onKeyDown,
  className = "",
  ariaLabel,
  title,
  width = "w-10",
  height = "h-10",
}) => {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleDoubleClick = () => {
    if (!isDisabled && onDoubleClick) {
      onDoubleClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDisabled && onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent context menu
    if (!isDisabled && onRightClick) {
      onRightClick();
    }
  };

  // Simple border without rounded corners
  const borderClasses = "border";

  return (
    <div className={`relative ${isMuted ? "opacity-40" : ""}`}>
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleRightClick}
        disabled={isDisabled}
        className={`${width} ${height} text-xs ${borderClasses} transition-all duration-200 flex items-center justify-center ${
          isDisabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
            : isSelectedByOthers
            ? "bg-pink-400 text-white border-pink-400 shadow-md"
            : `${
                isMuted ? "bg-gray-200" : "bg-white"
              } text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50`
        } ${
          isSelected ? "shadow-[inset_0_0_0_2px_#059669] border-none" : ""
        } ${className}`}
        tabIndex={isDisabled ? -1 : 0}
        aria-label={ariaLabel || label}
        title={title || label}
        onKeyDown={handleKeyDown}
      >
        {/* Icon rendering */}
        {icon && (
          <>
            {typeof icon === "string" ? (
              <img
                src={icon}
                alt={label}
                className={`w-8 h-8 object-contain ${
                  isMuted ? "opacity-50" : ""
                }`}
                onError={(e) => {
                  // Fallback to question mark if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.classList.remove("hidden");
                  }
                }}
              />
            ) : (
              icon
            )}
            {/* Hidden fallback for image load errors */}
            {typeof icon === "string" && (
              <div className="hidden w-6 h-6 flex items-center justify-center text-gray-400 font-bold text-lg">
                ?
              </div>
            )}
          </>
        )}

        {/* Fallback icon for when no icon is provided */}
        {!icon && (
          <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold text-lg">
            ?
          </div>
        )}
      </button>

      {/* Badge for selected items */}
      {isSelected && !isSelectedByOthers && !isDisabled && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center z-10 shadow-lg">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default ItemButton;
