// shared/components/modal/ModalFooter.tsx
import React from "react";

const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end gap-4 px-2 py-4">
      {children}
    </div>
  );
};

export default ModalFooter;
