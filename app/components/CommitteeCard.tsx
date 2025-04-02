import { motion } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { CommitteeProgress } from "../types/unfreeze";
import ProgressBar from "./ProgressBar";
import { useState, useEffect } from "react";
import CommitteeDialog from "./CommitteeDialog";

interface CommitteeCardProps {
  committee: {
    name: string;
    slug: string;
    emoji: string;
  };
  data: CommitteeProgress;
}

export default function CommitteeCard({ committee, data }: CommitteeCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setIsOpen(hash === committee.slug);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [committee.slug]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // 如果目前的 hash 是這個委員會，才清除
      const hash = window.location.hash.slice(1);
      if (hash === committee.slug) {
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search,
        );
      }
    } else {
      window.location.hash = committee.slug;
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <motion.button
          className={`relative cursor-pointer overflow-hidden rounded-xl bg-gray-100 text-gray-900 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-300`}
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <div className="flex h-28 flex-col items-center justify-center p-2">
            <motion.span className="mb-1 text-3xl sm:mb-2 sm:text-4xl">
              {committee.emoji}
            </motion.span>
            <span className="text-center text-xs sm:text-sm">
              {committee.name}
            </span>
          </div>

          <ProgressBar
            pending={data.statusCounts.PENDING}
            approved={data.statusCounts.APPROVED}
            unfrozen={data.statusCounts.UNFROZEN}
            total={data.totalCases}
            height="md"
            showTooltip={false}
            rounded={false}
          />
        </motion.button>
      </Dialog.Trigger>
      <CommitteeDialog committee={committee} data={data} isOpen={isOpen} />
    </Dialog.Root>
  );
}
