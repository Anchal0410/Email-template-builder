import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/Button";
import { Image as ImageIcon } from "lucide-react";

const EmailPreview = ({ emailContent, onSelect }) => {
  return (
    <div className="flex-1">
      <Card className="bg-white p-8 min-h-[600px]">
        {/* Logo Area */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-lg p-4 mb-6 text-center cursor-pointer hover:border-gray-300"
          onClick={() => onSelect("logo")}
        >
          {emailContent.logo ? (
            <img src={emailContent.logo} alt="Logo" className="h-12 mx-auto" />
          ) : (
            "Add Logo"
          )}
        </div>

        {/* Title */}
        <div
          className="text-3xl font-bold text-center mb-4 cursor-pointer"
          onClick={() => onSelect("title")}
        >
          {emailContent.title}
        </div>

        {/* Content */}
        <div
          className="text-center text-gray-600 mb-6 cursor-pointer"
          onClick={() => onSelect("content")}
        >
          {emailContent.content}
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <Button>{emailContent.buttonText}</Button>
        </div>

        {/* Image */}
        <div className="mt-6">
          {emailContent.image ? (
            <img
              src={emailContent.image}
              alt="Email content"
              className="rounded-lg w-full"
              onClick={() => onSelect("image")}
            />
          ) : (
            <div
              className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center cursor-pointer hover:border-gray-300"
              onClick={() => onSelect("image")}
            >
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Click to add image</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EmailPreview;
