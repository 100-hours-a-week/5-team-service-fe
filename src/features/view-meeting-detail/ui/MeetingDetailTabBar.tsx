import { MeetingDetailTabKey, TAB_ITEMS } from "../model/constants";

type MeetingDetailTabBarProps = {
  activeTab: MeetingDetailTabKey;
  onClickTab: (tab: MeetingDetailTabKey) => void;
};

export default function MeetingDetailTabBar({ activeTab, onClickTab }: MeetingDetailTabBarProps) {
  return (
    <nav
      data-meeting-detail-tabbar
      className="sticky top-0 z-10 bg-white px-5 py-1"
      aria-label="모임 상세 탭"
    >
      <ul className="grid grid-cols-5 gap-1 py-3">
        {TAB_ITEMS.map((tab) => (
          <li key={tab.key} className="min-w-0">
            <button
              type="button"
              onClick={() => onClickTab(tab.key)}
              className={`w-full whitespace-nowrap border-b-2 pb-2 text-center text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-primary !font-[700]"
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
