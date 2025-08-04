import React from "react";

interface ItemButtonProps {
  icon?: string | React.ReactNode;
  label: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  isSelectedByOthers?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
  isFirstRow?: boolean;
  isLastRow?: boolean;
  isFirstCol?: boolean;
  isLastCol?: boolean;
  width?: string;
  height?: string;
}

const ItemButton: React.FC<ItemButtonProps> = ({
  icon,
  label,
  isSelected = false,
  isDisabled = false,
  isSelectedByOthers = false,
  onClick,
  onKeyDown,
  className = "",
  ariaLabel,
  title,
  isFirstRow = false,
  isLastRow = false,
  isFirstCol = false,
  isLastCol = false,
  width = "w-10",
  height = "h-10",
}) => {
  const handleClick = () => {
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDisabled && onKeyDown) {
      onKeyDown(e);
    }
  };

  // If all position props are true, this is a standalone button - give it full borders and rounded corners
  const isStandalone = isFirstRow && isLastRow && isFirstCol && isLastCol;

  // Build rounded corner classes based on position
  const roundedClasses = isStandalone
    ? "rounded-lg" // Standalone buttons get full rounded corners
    : [
        isFirstRow && isFirstCol ? "rounded-tl-lg" : "",
        isFirstRow && isLastCol ? "rounded-tr-lg" : "",
        isLastRow && isFirstCol ? "rounded-bl-lg" : "",
        isLastRow && isLastCol ? "rounded-br-lg" : "",
      ]
        .filter(Boolean)
        .join(" ");

  // Build selective border classes to avoid doubling

  const borderClasses = isStandalone
    ? "border" // Standalone buttons get full border
    : [
        "border-t", // Grid buttons get top border
        "border-l", // Grid buttons get left border
        isLastCol ? "border-r" : "", // Only last column gets right border
        isLastRow ? "border-b" : "", // Only last row gets bottom border
      ]
        .filter(Boolean)
        .join(" ");

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`${width} ${height} text-xs ${borderClasses} transition-all duration-200 flex items-center justify-center ${roundedClasses} ${
          isDisabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60"
            : isSelected
            ? "bg-pink-400 text-white border-pink-400 shadow-md"
            : "bg-white text-gray-700 border-gray-300 hover:border-pink-300 hover:bg-pink-50"
        } ${
          isSelectedByOthers ? "shadow-[inset_0_0_0_2px_#059669]" : ""
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
                className="w-8 h-8 object-contain"
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

      {/* Badge for items selected by other characters */}
      {isSelectedByOthers && !isSelected && !isDisabled && (
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center z-10 shadow-sm">
          <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default ItemButton;
