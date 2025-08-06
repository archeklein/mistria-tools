import React from "react";
import { getCharacterIcon } from "../../utils/icons";

interface AvatarProps {
  character?:
    | {
        name: string;
        icon: string;
      }
    | string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ character, className = "" }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Fallback to a simple avatar if image fails to load
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const fallback = target.nextElementSibling as HTMLElement;
    if (fallback) {
      fallback.classList.remove("hidden");
    }
  };

  // Handle different character input types
  const characterName =
    typeof character === "string" ? character : character?.name || "";
  const characterIcon = typeof character === "object" && character?.icon;

  // If no character or no icon, show initials fallback
  if (!character || !characterIcon) {
    return (
      <div
        className={`overflow-hidden flex items-center justify-center ${className}`}
        title={characterName}
      >
        <div className="text-lg font-bold text-emerald-600">
          {characterName.charAt(0)}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden flex items-center justify-center ${className}`}
    >
      <img
        src={getCharacterIcon(characterIcon)}
        alt={`${characterName} icon`}
        className="w-full h-full object-cover"
        title={characterName}
        onError={handleImageError}
      />
      <div
        className="hidden text-lg font-bold text-emerald-600"
        title={characterName}
      >
        {characterName.charAt(0)}
      </div>
    </div>
  );
};

export default Avatar;
