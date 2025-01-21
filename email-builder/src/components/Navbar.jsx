import React from "react";
import Button from "./ui/Button";

const Navbar = () => {
  return (
    <nav className="border-b bg-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm">
          ← Back
        </Button>
        <span className="font-medium">Welcome email</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save</Button>
      </div>
    </nav>
  );
};

export default Navbar;
