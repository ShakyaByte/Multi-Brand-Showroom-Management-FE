// shared/components/modal/ModalHeader.tsx
import BellIcon from "@/shared/components/icons/bellIcon";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader = ({ title, onClose }: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 shadow-custom dark:bg-secondary dark:rounded-t-lg dark:border-[#334155] dark:shadow-none">
      <div className="flex items-center gap-2">
        <BellIcon />
        <h2 className="text-[16px] font-medium text-primary dark:text-white">
          {title}
        </h2>
      </div>

      <button
        onClick={onClose}
        className="px-2.5 py-2 rounded-xl text-sm bg-red-100 text-error font-medium w-19 h-10 cursor-pointer dark:bg-red-500 dark:text-white" 
      >
        Close
      </button>
    </div>
  );
};

export default ModalHeader;
