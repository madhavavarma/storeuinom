import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

interface FloatingButtonWithTTProps {
  icon: React.ReactNode; // Icon passed as a React component
  onClick: () => void;   // Function to execute on button click
  tooltipContent: string; // Tooltip content to display
}

export const FloatingButtonWithTT: React.FC<FloatingButtonWithTTProps> = ({
  icon,
  onClick,
  tooltipContent,
}) => (
  <div >
    <TooltipProvider>
      <Tooltip>
        {/* TooltipTrigger should wrap the button */}
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="rounded-full p-4 bg-green-500 text-white shadow-lg hover:bg-green-900 focus:outline-none"
            onClick={onClick} // Handle the button click event
          >
            {icon} {/* Render the passed icon */}
          </Button>
        </TooltipTrigger>
        {/* Tooltip content */}
        <TooltipContent>
          <p>{tooltipContent}</p> {/* Display passed tooltip content */}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
);

export default FloatingButtonWithTT;
