export default function Tabs({ activeTab, setActiveTab, tabs }) {

    return (
        <div className="pl-2 pr-2 overflow-y-auto">
            <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                    Select a tab
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    id="tabs"
                    name="tabs"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md capitalize"
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                >
                    {tabs.map((tab) => (
                        <option value={tab.href} key={tab.href}>
                            {tab.name}
                            {tab.count ? ' (' + String(tab.count) + ')' : null}
                        </option>
                    ))}
                </select>
            </div>
            <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.href}>
                                <span
                                    onClick={() => setActiveTab(tab.href)}
                                    className={
                                        `${tab.href === activeTab
                                            ? 'border-indigo-500 text-indigo-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}
                                        whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm capitalize`
                                    }
                                    aria-current={tab.href === activeTab ? 'page' : undefined}
                                >
                                    {tab.name}

                                    {tab.count ? (
                                        <span
                                            className={`${tab.href === activeTab
                                                ? 'bg-indigo-100 text-indigo-600'
                                                : 'bg-gray-100 text-gray-900'}
                                                 ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium sm:inline-block'
                                            `}
                                        >
                                            {String(tab.count)}
                                        </span>
                                    ) : null}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
