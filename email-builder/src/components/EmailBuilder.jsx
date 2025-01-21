import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Type,
  Download,
} from "lucide-react";

const EmailBuilder = () => {
  // State for template and content
  const [template, setTemplate] = useState("");
  const [emailContent, setEmailContent] = useState({
    title: "Email has never been easier",
    content: "Create beautiful and sophisticated emails in minutes.",
    image: null,
    alignment: "center",
    isBold: false,
    isItalic: false,
    color: "#000000",
    fontSize: "medium",
  });
  const [emailConfig, setEmailConfig] = useState({
    title: "Email Templates make the email more effective and precise",
    body: "Try it yourself !",
    logoUrl: null,
  });
  // State for sections order
  const [sections, setSections] = useState(["title", "content", "image"]);
  const [selectedElement, setSelectedElement] = useState(null);
  const API_URL = "http://localhost:5000/api";
  // Fetch template from backend
  useEffect(() => {
    const API_URL = "http://localhost:5000/api";

    // Example fetch call
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${API_URL}/getEmailLayout`);
        const html = await response.text();
        setTemplate(html);
      } catch (error) {
        console.error("Error fetching template:", error);
      }
    };
    fetchTemplate();
  }, []);

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_URL}/uploadImage`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setEmailConfig((prev) => ({
        ...prev,
        logoUrl: `http://localhost:5000${data.imageUrl}`,
      }));
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  // Handle text changes
  const handleTextChange = (field, value) => {
    setEmailContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Create FormData and append file
    const formData = new FormData();
    formData.append("image", file);

    try {
      // Make sure to use the complete URL including port number
      const response = await fetch("http://localhost:5000/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Construct the full URL for the image
      const fullImageUrl = `http://localhost:5000${data.imageUrl}`;

      setEmailContent((prev) => ({
        ...prev,
        image: fullImageUrl,
      }));

      console.log("Image uploaded successfully:", fullImageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };
  // Handle section reordering
  const moveSection = (index, direction) => {
    const newSections = [...sections];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < sections.length) {
      [newSections[index], newSections[newIndex]] = [
        newSections[newIndex],
        newSections[index],
      ];
      setSections(newSections);
    }
  };

  // Save template to backend
  const saveTemplate = async () => {
    try {
      await fetch("/api/uploadEmailConfig", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: emailContent,
          sections: sections,
        }),
      });
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  // Render sections based on order
  const renderSection = (section) => {
    switch (section) {
      case "title":
        return (
          <div
            key="title"
            className="relative"
            style={{
              color: emailContent.color,
              fontSize: getFontSize(emailContent.fontSize),
            }}
          >
            <div
              className={`text-3xl mb-4 ${
                emailContent.isBold ? "font-bold" : ""
              }
              ${emailContent.isItalic ? "italic" : ""} text-${
                emailContent.alignment
              }`}
            >
              {emailContent.title}
            </div>
          </div>
        );
      case "content":
        return (
          <div
            key="content"
            className="relative"
            style={{
              color: emailContent.color,
              fontSize: getFontSize(emailContent.fontSize),
            }}
          >
            <div
              className={`mb-6 ${emailContent.isBold ? "font-bold" : ""}
              ${emailContent.isItalic ? "italic" : ""} text-${
                emailContent.alignment
              }`}
            >
              {emailContent.content}
            </div>
          </div>
        );
      case "image":
        return (
          <div key="image" className="relative">
            {emailContent.image ? (
              <img
                src={emailContent.image}
                alt="Email content"
                className="mt-6 rounded-lg w-full"
              />
            ) : (
              <div className="mt-6 border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Add image</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // const handleDownload = async () => {
  //   try {
  //     const response = await fetch(`${API_URL}/renderAndDownloadTemplate`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         title: emailContent.title,
  //         content: emailContent.content,
  //         image: emailContent.image,
  //         logoUrl: emailContent.image, // Make sure this contains the full URL
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Download failed");

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "email-template.html";
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading template:", error);
  //   }
  // };
  // const handleDownload = async () => {
  //   try {
  //     // Create object with content and section order
  //     const templateData = {
  //       content: emailContent,
  //       sections: sections, // Include the sections array
  //     };

  //     const response = await fetch(`${API_URL}/renderAndDownloadTemplate`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(templateData),
  //     });

  //     if (!response.ok) throw new Error("Download failed");

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = "email-template.html";
  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Error downloading template:", error);
  //   }
  // };

  const handleDownload = async () => {
    try {
      const templateData = {
        content: {
          ...emailContent,
          color: emailContent.color || "#000000",
          alignment: emailContent.alignment || "left",
          fontSize: emailContent.fontSize || "medium",
          isBold: emailContent.isBold || false,
          isItalic: emailContent.isItalic || false,
        },
        sections: sections,
      };

      console.log("Sending template data:", templateData); // Debug log

      const response = await fetch(`${API_URL}/renderAndDownloadTemplate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "email-template.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("Failed to download template");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            ← Back
          </Button>
          <span className="font-medium">Email Editor</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={saveTemplate}>
            Save
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Preview */}
        <div className="flex-1">
          <Card className="bg-white p-8">
            {sections.map((section, index) => (
              <div key={section} className="relative group">
                {renderSection(section)}
                <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Editor */}
        <div className="w-80">
          <Card className="p-4">
            <div className="space-y-4">
              {/* Text Controls */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Format</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={emailContent.isBold ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleTextChange("isBold", !emailContent.isBold)
                    }
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={emailContent.isItalic ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      handleTextChange("isItalic", !emailContent.isItalic)
                    }
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  {["left", "center", "right"].map((align) => (
                    <Button
                      key={align}
                      variant={
                        emailContent.alignment === align ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTextChange("alignment", align)}
                    >
                      {align === "left" && <AlignLeft className="h-4 w-4" />}
                      {align === "center" && (
                        <AlignCenter className="h-4 w-4" />
                      )}
                      {align === "right" && <AlignRight className="h-4 w-4" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Font Size</label>
                <div className="flex gap-2">
                  {["small", "medium", "large"].map((size) => (
                    <Button
                      key={size}
                      variant={
                        emailContent.fontSize === size ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handleTextChange("fontSize", size)}
                    >
                      <Type className="h-4 w-4" />
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Color</label>
                <Input
                  type="color"
                  value={emailContent.color}
                  onChange={(e) => handleTextChange("color", e.target.value)}
                />
              </div>

              {/* Content Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    value={emailContent.title}
                    onChange={(e) => handleTextChange("title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <Textarea
                    value={emailContent.content}
                    onChange={(e) =>
                      handleTextChange("content", e.target.value)
                    }
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image
                  </label>
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
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const getFontSize = (size) => {
  switch (size) {
    case "small":
      return "0.875rem";
    case "large":
      return "1.25rem";
    default:
      return "1rem";
  }
};

export default EmailBuilder;
