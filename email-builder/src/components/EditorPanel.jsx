import React from "react";
import { Card } from "./ui/card";
import Button from "./ui/Button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
} from "lucide-react";

const EditorPanel = ({ selectedElement, content, onUpdate }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(selectedElement, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-80">
      <Card className="p-4">
        <div className="space-y-4">
          {/* Text Formatting */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <div className="flex space-x-1">
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content Editor */}
          {selectedElement === "title" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={content.title}
                onChange={(e) => onUpdate("title", e.target.value)}
                placeholder="Enter title"
              />
            </div>
          )}

          {selectedElement === "content" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content.content}
                onChange={(e) => onUpdate("content", e.target.value)}
                placeholder="Enter content"
                rows={4}
              />
            </div>
          )}

          {/* Image Upload */}
          {(selectedElement === "image" || selectedElement === "logo") && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {selectedElement === "logo" ? "Upload Logo" : "Upload Image"}
              </label>
              <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  Choose File
                </Button>
              </div>
            </div>
          )}

          {/* Font Settings */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Font Size</label>
            <div className="flex space-x-2">
              {["Sm", "Base", "Lg", "Xl"].map((size) => (
                <Button
                  key={size}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Color</label>
            <div className="flex space-x-2">
              {["#000000", "#2563EB", "#DC2626", "#047857"].map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => onUpdate("color", color)}
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditorPanel;
