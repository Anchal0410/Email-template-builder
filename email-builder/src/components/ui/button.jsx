import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
          "bg-black text-white hover:bg-gray-800",
          variant === "outline" &&
            "bg-transparent border border-gray-200 text-gray-900 hover:bg-gray-100",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
