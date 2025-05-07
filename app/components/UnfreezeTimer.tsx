"use client";
import { useEffect, useState } from "react";
import { UnfreezeStatus, type CommitteeProgress } from "../types/unfreeze";
import unfreezeData from "../data/unfreeze-progress.json";
import ProgressBar from "./ProgressBar";
import CommitteeCard from "./CommitteeCard";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";

const START_DATE = new Date(unfreezeData.startDate);
const COMMITTEES = unfreezeData.committees;

const calculateTotalCases = (statusCounts: Record<string, number>) => {
  return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
};

const DATA: CommitteeProgress[] = COMMITTEES.map((committee) => {
  const totalCases = calculateTotalCases(committee.statusCounts);
  return {
    committee: committee.name,
    totalCases,
    statusCounts: {
      [UnfreezeStatus.FROZEN]: committee.statusCounts.FROZEN,
      [UnfreezeStatus.PENDING]: committee.statusCounts.PENDING,
      [UnfreezeStatus.APPROVED]: committee.statusCounts.APPROVED,
      [UnfreezeStatus.UNFROZEN]: committee.statusCounts.UNFROZEN,
    },
    progress: Number(
      ((committee.statusCounts.UNFROZEN / totalCases) * 100).toFixed(1),
    ),
  };
});

// 計算總進度
const TOTAL_PROGRESS = {
  totalCases: DATA.reduce((sum, committee) => sum + committee.totalCases, 0),
  statusCounts: {
    [UnfreezeStatus.FROZEN]: DATA.reduce(
      (sum, committee) => sum + committee.statusCounts[UnfreezeStatus.FROZEN],
      0
    ),
    [UnfreezeStatus.PENDING]: 1288, // 直接使用行政院送進來的總數
    [UnfreezeStatus.APPROVED]: DATA.reduce(
      (sum, committee) => sum + committee.statusCounts[UnfreezeStatus.APPROVED],
      0
    ),
    [UnfreezeStatus.UNFROZEN]: DATA.reduce(
      (sum, committee) => sum + committee.statusCounts[UnfreezeStatus.UNFROZEN],
      0
    ),
  },
};

const OFFICIAL_TOTAL_CASES = 1584;

export default function UnfreezeTimer() {
  const [elapsedTime, setElapsedTime] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(`${days}天 ${hours}小時 ${minutes}分 ${seconds}秒`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "總預算解凍進度",
      text: `總預算解凍進度：${(
        (TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN] /
          OFFICIAL_TOTAL_CASES) *
        100
      ).toFixed(1)}%`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("已複製連結");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Tooltip.Provider>
      <div className="mx-auto w-full max-w-2xl space-y-6 p-6 md:p-12">
        <div className="flex items-center justify-between">
          <h2 className="text-center text-4xl font-semibold text-gray-900 dark:text-white">
            總預算解凍進度
          </h2>
          <button
            onClick={handleShare}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="分享"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
          </button>
        </div>
        <div className="space-y-2 rounded-xl bg-gray-100 p-4 text-center dark:bg-gray-800">
          <p className="text-lg text-gray-700 dark:text-gray-200">
            距離總統公告總預算已經過了
          </p>
          <div className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            {elapsedTime || `0天 0小時 0分 0秒`}
          </div>
        </div>

        {/* 總進度條 */}
        <div className="relative pt-1">
          <div className="mb-2 flex items-end justify-between">
            <div className="text-right">
              <span className="inline-block text-lg font-semibold text-gray-700 dark:text-gray-200">
                總體進度
              </span>
            </div>
            <div className="flex items-center gap-2 text-right">
              <span className="text-primary dark:text-primary inline-block text-sm">
                已解凍{" "}
                {(
                  (TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN] /
                    OFFICIAL_TOTAL_CASES) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl">
            <ProgressBar
              pending={TOTAL_PROGRESS.statusCounts[UnfreezeStatus.PENDING]}
              approved={TOTAL_PROGRESS.statusCounts[UnfreezeStatus.APPROVED]}
              unfrozen={TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN]}
              total={OFFICIAL_TOTAL_CASES}
              height="lg"
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-sm">
            <span className="inline-block text-gray-600 dark:text-gray-400">
              {TOTAL_PROGRESS.statusCounts[UnfreezeStatus.PENDING]} 案已送件
            </span>{" "}
            <span className="inline-block text-gray-600 dark:text-gray-400">
              {TOTAL_PROGRESS.statusCounts[UnfreezeStatus.UNFROZEN]} /{" "}
              {OFFICIAL_TOTAL_CASES} 案
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button
                    onClick={() => setIsInfoOpen(true)}
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    aria-label="案件總數說明"
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
                        根據行政院新聞稿，114年度中央政府總預算凍結項目共1,584項。
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        資料來源：行政院新聞稿
                      </p>
                    </div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {COMMITTEES.map((committee, index) => (
            <CommitteeCard
              key={committee.name}
              committee={committee}
              data={DATA[index]}
            />
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-gray-700 dark:text-gray-200">等待審議</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-gray-700 dark:text-gray-200">審議通過</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-gray-700 dark:text-gray-200">已解凍</span>
          </div>
        </div>

        <Dialog.Root open={isInfoOpen} onOpenChange={setIsInfoOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <Dialog.Title className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                案件總數說明
              </Dialog.Title>
              <div className="space-y-4">
                <p>
                  根據行政院新聞稿，114年度中央政府總預算凍結項目共1,584項。
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  資料來源：行政院新聞稿
                </p>
                <a
                  href="https://www.ey.gov.tw/Page/9277F759E41CCD91/453f654c-ecca-4ff3-b5a8-9af17f091663"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  查看原始新聞稿
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="ml-1 h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              </div>
              <Dialog.Close className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </Tooltip.Provider>
  );
}
