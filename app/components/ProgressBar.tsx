import { motion } from "motion/react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { memo } from "react";

const tooltipAnimation = {
  initial: { opacity: 0, scale: 0.9, y: 5 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 5 },
  transition: { type: "spring", duration: 0.2 },
};

interface ProgressBarProps {
  pending: number;
  approved: number;
  unfrozen: number;
  total: number;
  showTooltip?: boolean;
  height?: "sm" | "md" | "lg";
  rounded?: boolean;
  onHover?: {
    pending?: () => void;
    approved?: () => void;
    unfrozen?: () => void;
  };
  onHoverEnd?: {
    pending?: () => void;
    approved?: () => void;
    unfrozen?: () => void;
  };
}

const Bar = memo(
  ({
    value,
    color,
    status,
    onHoverStart,
    onHoverEnd,
    total,
    showTooltip,
  }: {
    value: number;
    color: string;
    status: "pending" | "approved" | "unfrozen";
    onHoverStart?: () => void;
    onHoverEnd?: () => void;
    total: number;
    showTooltip?: boolean;
  }) => {
    const percentage = (value / total) * 100;
    const element = (
      <motion.div
        className={`h-full ${color} ${showTooltip ? "cursor-help" : ""}`}
        initial={{ width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
        onHoverStart={onHoverStart}
        onHoverEnd={onHoverEnd}
      />
    );

    if (!showTooltip) return element;

    const statusText = {
      pending: "等待審議",
      approved: "審議通過",
      unfrozen: "已解凍",
    };

    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{element}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={5} asChild>
            <motion.div
              className="rounded-lg border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 shadow-lg dark:border-gray-500 dark:bg-gray-700 dark:text-white"
              {...tooltipAnimation}
            >
              <div className="flex items-center gap-1">
                <div className={`size-2 rounded-full ${color}`} />
                {statusText[status]}
              </div>
              <div>{value} 案</div>
            </motion.div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  },
);

Bar.displayName = "Bar";

function ProgressBarComponent({
  pending,
  approved,
  unfrozen,
  total,
  showTooltip = true,
  height = "md",
  rounded = true,
  onHover,
  onHoverEnd,
}: ProgressBarProps) {
  const heightClass = {
    sm: "h-1.5",
    md: "h-3",
    lg: "h-6",
  };

  return (
    <Tooltip.Provider delayDuration={200}>
      <div
        className={`${heightClass[height]} flex overflow-hidden ${rounded ? "rounded-full" : ""} bg-gray-200 dark:bg-gray-700`}
      >
        <Bar
          value={pending}
          color="bg-blue-500"
          status="pending"
          onHoverStart={onHover?.pending}
          onHoverEnd={onHoverEnd?.pending}
          total={total}
          showTooltip={showTooltip}
        />
        <Bar
          value={approved}
          color="bg-orange-500"
          status="approved"
          onHoverStart={onHover?.approved}
          onHoverEnd={onHoverEnd?.approved}
          total={total}
          showTooltip={showTooltip}
        />
        <Bar
          value={unfrozen}
          color="bg-green-500"
          status="unfrozen"
          onHoverStart={onHover?.unfrozen}
          onHoverEnd={onHoverEnd?.unfrozen}
          total={total}
          showTooltip={showTooltip}
        />
      </div>
    </Tooltip.Provider>
  );
}

ProgressBarComponent.displayName = "ProgressBar";

const ProgressBar = memo(ProgressBarComponent);

export default ProgressBar;
