import { Dispatch, SetStateAction } from "react";

type TabCategories = "MEETING" | "REPORT" | "MEMBER";

type MyMeetingTabBarProps = {
  activeTab: TabCategories;
  convertTab: Dispatch<SetStateAction<TabCategories>>;
};

export default function MyMeetingTabBar({ activeTab, convertTab }: MyMeetingTabBarProps) {
  const tabItems: { value: TabCategories; label: string }[] = [
    { value: "MEETING", label: "모임 참여" },
    { value: "REPORT", label: "독후감 관리" },
    { value: "MEMBER", label: "모임원 관리" },
  ];

  return (
    <div className="py-4 ">
      <div className="grid grid-cols-3 gap-2 ">
        {tabItems.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => convertTab(tab.value)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={`text-label font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`h-1 w-full transition-colors ${
                  isActive ? "bg-primary" : "bg-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
