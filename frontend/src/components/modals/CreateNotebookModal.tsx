import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, BookOpen, Plus, Tag } from "lucide-react";
import { useMecG } from "../../context/MecGContext";

export const CreateNotebookModal: React.FC = () => {
  const navigate = useNavigate();
  const { isCreateNotebookOpen, setIsCreateNotebookOpen, createNotebook } = useMecG();

  const [name, setName] = useState("");
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [subsystem, setSubsystem] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(["hydraulics", "field-service"]);

  if (!isCreateNotebookOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newNb = createNotebook({
      name: name.trim(),
      equipmentName: equipmentName.trim() || "Industrial Machinery",
      equipmentType: equipmentType.trim() || "Heavy Equipment",
      manufacturer: manufacturer.trim() || "OEM",
      modelNumber: modelNumber.trim() || "Standard",
      subsystem: subsystem.trim() || "Main Assembly",
      description: description.trim() || "Technical documentation, diagnostic logs, and procedures.",
      tags
    });

    setIsCreateNotebookOpen(false);
    navigate(`/notebooks/${newNb.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101318]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#171A21] border border-[#252B35] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#252B35]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2B544]/15 text-[#F2B544] border border-[#F2B544]/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Create Engineering Notebook</h3>
              <p className="text-xs font-mono text-[#929AA6]">NotebookLM-style research workspace for specific assets</p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateNotebookOpen(false)}
            className="p-1.5 rounded-lg text-[#929AA6] hover:text-white hover:bg-[#252B35] transition-colors cursor-pointer border border-[#252B35]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
              Notebook Name <span className="text-[#F2B544]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Yaw Hydraulic Relief Valve Overhaul"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
                Equipment / Asset Name
              </label>
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                placeholder="e.g. Vestas V112 Turbine"
                className="w-full px-3 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
                Subsystem
              </label>
              <input
                type="text"
                value={subsystem}
                onChange={(e) => setSubsystem(e.target.value)}
                placeholder="e.g. Nacelle Yaw Circuit"
                className="w-full px-3 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
                Manufacturer (OEM)
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g. Vestas Wind Systems"
                className="w-full px-3 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
                Model / Part Number
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="e.g. PRV-992-B / V112-3.3MW"
                className="w-full px-3 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
              Description & Scope
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What specific fault, procedure, or maintenance scope does this notebook target?"
              className="w-full px-3.5 py-2 rounded-xl bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544] leading-relaxed resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#929AA6] tracking-wider mb-1">
              Tags
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter"
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#101318] border border-[#252B35] text-xs font-mono text-white placeholder-[#647082] focus:outline-none focus:border-[#F2B544]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-lg bg-[#252B35] hover:bg-[#353E4C] text-xs font-mono text-white cursor-pointer"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-0.5 rounded-md bg-[#101318] border border-[#252B35] text-[11px] font-mono text-[#F2B544] flex items-center gap-1.5"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-red-400 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#252B35] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateNotebookOpen(false)}
              className="btn-slate-secondary px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-amber-primary px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Notebook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

