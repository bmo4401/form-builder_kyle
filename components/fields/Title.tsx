"use client";
import useForms, { SelectedElementType } from "@/hooks/useForms";
import { DndElementType } from "@/types/element";
import { Heading1 } from "lucide-react";
import { useState } from "react";

interface DesignProps {
  element: SelectedElementType;
}

const Title: DndElementType = {
  designComponent: Design,
  designOverlay: DesignOverlay,
  formComponent: Form,
  propertyComponent: Property,
  type: "Title",
  icon: Heading1,
  attribute: {
    design: { input: "", isRequired: false },
  },
};

function Design({ element }: DesignProps) {
  const { updateElement } = useForms();
  const [mode, setMode] = useState(false);
  const [input, setInput] = useState(element.attribute?.design.input);
  const [isRequired, setIsRequired] = useState(
    element.attribute?.design.isRequired,
  );
  const update = () => {
    updateElement({
      element: { ...element, attribute: { design: { input, isRequired } } },
    });
    setMode(!mode);
  };
  return (
    <div className="group relative  flex h-24 w-full flex-col items-start justify-center gap-3 rounded-md border border-slate-500 px-6 py-3">
      {mode ? (
        <div className="h-fit w-full  gap-5  ">
          <input
            value={input ?? ""}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && update();
            }}
            className="w-1/2 bg-transparent text-white outline-none"
            placeholder={Title.type}
            autoComplete="off"
            autoFocus
            spellCheck={false}
          />
          <input
            id="required"
            type="checkbox"
            checked={isRequired}
            onChange={() => setIsRequired(!isRequired)}
          />
          <label htmlFor="required" className="pl-2">
            Required
          </label>
        </div>
      ) : (
        <span
          className="flex w-full items-center gap-2 hover:cursor-pointer hover:opacity-80"
          onDoubleClick={() => setMode(!mode)}
        >
          <span> {input.length !== 0 ? input : Title.type}</span>
          {isRequired && <span className="text-rose-500">*</span>}
        </span>
      )}

      <div
        onClick={() => {
          if (mode) {
            update();
            setMode(!mode);
          }
        }}
        className="flex h-10 w-full select-none items-center rounded-md text-slate-500"
      >
        {Title.type} will display here.
      </div>
    </div>
  );
}
interface FormProps {
  element: SelectedElementType;
}
function Form({ element }: FormProps) {
  const { input, isRequired } = element.attribute?.design;
  return (
    <span className="flex  items-center gap-2 px-3 py-1">
      <span className="leading-none">
        {" "}
        {input.length !== 0 ? input : Title.type}
      </span>
      {isRequired && <span className="leading-none text-rose-500">*</span>}
    </span>
  );
}

function DesignOverlay() {
  return (
    <div className="group relative  flex h-24 w-full flex-col items-start justify-center gap-3 rounded-md border border-slate-500 px-6 py-3">
      <span className="flex w-full items-center gap-2 hover:cursor-pointer hover:opacity-80">
        {Title.type}
      </span>

      <div className="flex h-10 w-full select-none items-center rounded-md text-slate-500">
        {Title.type} will display here.
      </div>
    </div>
  );
}

function Property() {
  return (
    <div className="flex w-24 flex-col items-center justify-center gap-1 rounded-md border border-slate-500 p-4">
      {Title.type}
      <Title.icon />
    </div>
  );
}

export default Title;
