import React from 'react';

interface ColorPickerProps {
  label: string;
  selectedColor: string;
  onChange: (color: string) => void;
  presets: string[];
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, selectedColor, onChange, presets }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <div className="flex flex-wrap gap-2">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
              selectedColor === color ? 'border-indigo-500 scale-110' : 'border-slate-600'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
        <div className="relative">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0"
          />
          <div 
            className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-700 text-xs text-white pointer-events-none"
            style={{ backgroundColor: presets.includes(selectedColor) ? undefined : selectedColor }}
          >
            +
          </div>
        </div>
      </div>
    </div>
  );
};
