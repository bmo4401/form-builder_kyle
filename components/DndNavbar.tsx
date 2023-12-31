"use client";
import { publishForm, saveForm } from "@/actions/form";
import { collectDataFieldOnDesignMode } from "@/components/FormTable";
import { Button } from "@/components/ui/Button";
import useForms from "@/hooks/useForms";
import useModal from "@/hooks/useModal";
import { cn } from "@/libs/utils";
import { Check, RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DndNavbar = ({ id }: { id: number }) => {
  const [isSuccess, setIsSuccess] = useState(true);
  const [isStick, setIsStick] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setShowPreviewModal } = useModal();
  const router = useRouter();
  const { elements, clearElement } = useForms();
  const handelSaveForm = async () => {
    setIsSuccess(false);
    const res = await saveForm({ id, content: JSON.stringify(elements) });

    if (res.id) {
      setTimeout(() => {
        setIsStick(true);
        setIsSuccess(true);
        setTimeout(() => {
          setIsStick(false);
        }, 1000);
      }, 1000);
    }
  };
  const handlePublishForm = async () => {
    setIsLoading(true);
    await saveForm({ id, content: JSON.stringify(elements) });
    let isFail = false;
    elements.forEach((element) => {
      if (
        collectDataFieldOnDesignMode[element.type] &&
        element.attribute?.design.input.length === 0
      ) {
        element.isValid = false;
        isFail = true;
        setIsLoading(false);
        router.refresh();
      }
    });
    if (isFail) return;
    const res = await publishForm({
      id,
      content: JSON.stringify(elements),
    });
    if (res.id) {
      setIsLoading(false);
      router.push(`/published/${res.id}`);
    } else {
      throw new Error("Some thing wen wrong");
    }
  };
  return (
    <nav className="flex items-center gap-3 px-3 text-base">
      <Button onClick={() => clearElement()}>Clear</Button>
      <Button
        onClick={handelSaveForm}
        className={cn("w-[5.5rem]", isStick && "bg-green-500")}
      >
        {isSuccess ? (
          isStick ? (
            <Check />
          ) : (
            "Save"
          )
        ) : (
          <RotateCw className="animate-spin opacity-80 duration-500" />
        )}
      </Button>
      <Button className="" onClick={() => setShowPreviewModal(true)}>
        Preview
      </Button>
      <Button className="bg-gradient border-none" onClick={handlePublishForm}>
        {!isLoading ? (
          "Publish"
        ) : (
          <RotateCw className="animate-spin opacity-80 duration-500" />
        )}
      </Button>
    </nav>
  );
};
export default DndNavbar;
