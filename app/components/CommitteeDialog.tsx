import { motion, AnimatePresence } from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { CommitteeProgress } from "../types/unfreeze";
import ProgressBar from "./ProgressBar";
import { useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface CommitteeDialogProps {
  committee: {
    name: string;
    emoji: string;
  };
  data: CommitteeProgress;
  isOpen: boolean;
}

export default function CommitteeDialog({
  committee,
  data,
  isOpen,
}: CommitteeDialogProps) {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild forceMount>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </Dialog.Overlay>
          <Dialog.Content asChild forceMount>
            <motion.div
              className="fixed inset-0 m-auto h-max max-h-[85vh] w-2xl max-w-[95vw] overflow-y-auto rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Dialog.Title asChild>
                <VisuallyHidden.Root>
                  {committee.name} 委員會解凍進度詳情
                </VisuallyHidden.Root>
              </Dialog.Title>
              <div className="mb-6 flex items-center gap-4">
                <span className="text-4xl">{committee.emoji}</span>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {committee.name}
                </h2>
              </div>

              <div className="space-y-6">
                {/* 大型進度條 */}
                <div className="relative">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      解凍進度
                    </span>
                    <span className="text-primary text-sm">
                      {data.progress}%
                    </span>
                  </div>
                  <ProgressBar
                    pending={data.statusCounts.PENDING}
                    approved={data.statusCounts.APPROVED}
                    unfrozen={data.statusCounts.UNFROZEN}
                    total={data.totalCases}
                    height="md"
                    onHover={{
                      pending: () => setActiveStatus("pending"),
                      approved: () => setActiveStatus("approved"),
                      unfrozen: () => setActiveStatus("unfreezed"),
                    }}
                    onHoverEnd={{
                      pending: () => setActiveStatus(null),
                      approved: () => setActiveStatus(null),
                      unfrozen: () => setActiveStatus(null),
                    }}
                  />
                  <div className="mt-2 flex items-center justify-between gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      {data.statusCounts.PENDING} 案已送件
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            aria-label="案件送件說明"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-4 w-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                              />
                            </svg>
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            sideOffset={5}
                            className="rounded-lg border-2 border-gray-200 bg-white px-2 py-1 text-sm text-gray-900 shadow-lg dark:border-gray-500 dark:bg-gray-700 dark:text-white"
                          >
                            <div className="max-w-xs">
                              <p>
                                行政院各部會單位目前送 1,288 案至立法院程序委員會，立法院議事單位及行政單位正在計算每個案件狀態及隸屬委員會，相關數字計算中。
                              </p>
                            </div>
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </span>
                    <span className="inline-block text-gray-600 dark:text-gray-400">
                      {data.statusCounts.UNFROZEN} / {data.totalCases} 案
                    </span>
                  </div>
                </div>

                {/* 詳細資訊 */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="rounded-lg bg-gray-100 px-4 py-3 dark:bg-gray-700">
                    <p className="text-primary text-3xl font-semibold">
                      {data.totalCases}
                    </p>
                    <h3 className="text-lg text-gray-900 dark:text-white">
                      總數
                    </h3>
                  </div>
                  <div
                    data-status="pending"
                    className={`rounded-lg bg-gray-100 px-4 py-3 transition-all duration-200 dark:bg-gray-700 ${
                      activeStatus === "pending"
                        ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800"
                        : ""
                    }`}
                  >
                    <p className="text-3xl font-semibold text-blue-500">
                      計算中
                    </p>
                    <h3 className="text-lg text-gray-900 dark:text-white">
                      等待審議
                    </h3>
                  </div>
                  <div
                    data-status="approved"
                    className={`rounded-lg bg-gray-100 px-4 py-3 transition-all duration-200 dark:bg-gray-700 ${
                      activeStatus === "approved"
                        ? "ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-gray-800"
                        : ""
                    }`}
                  >
                    <p className="text-3xl font-semibold text-orange-500">
                      {data.statusCounts.APPROVED}
                    </p>
                    <h3 className="text-lg text-gray-900 dark:text-white">
                      審議通過
                    </h3>
                  </div>
                  <div
                    data-status="unfreezed"
                    className={`rounded-lg bg-gray-100 px-4 py-3 transition-all duration-200 dark:bg-gray-700 ${
                      activeStatus === "unfreezed"
                        ? "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-800"
                        : ""
                    }`}
                  >
                    <p className="text-3xl font-semibold text-green-500">
                      {data.statusCounts.UNFROZEN}
                    </p>
                    <h3 className="text-lg text-gray-900 dark:text-white">
                      已解凍
                    </h3>
                  </div>
                </div>
              </div>

              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 inline-flex h-8 w-8 appearance-none items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none"
                  aria-label="關閉"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                  >
                    <path
                      d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03157 3.2184C3.80702 2.99385 3.44295 2.99385 3.2184 3.2184C2.99385 3.44295 2.99385 3.80702 3.2184 4.03157L6.68682 7.50005L3.2184 10.9685C2.99385 11.193 2.99385 11.5571 3.2184 11.7816C3.44295 12.0062 3.80702 12.0062 4.03157 11.7816L7.50005 8.31322L10.9685 11.7816C11.193 12.0062 11.5571 12.0062 11.7816 11.7816C12.0062 11.5571 12.0062 11.193 11.7816 10.9685L8.31322 7.50005L11.7816 4.03157Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </Dialog.Close>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </AnimatePresence>
  );
}
