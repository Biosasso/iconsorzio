
export default function ButtonWithIconLeft({ icon, clicked, text, color }) {

    const item = { icon: icon };

    return (
        <>

            <button
                onClick={clicked}
                type="button"
                className={`w-full inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-${color ? color : 'indigo'}-600 hover:bg-${color ? color : 'indigo'}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color ? color : 'indigo'}-500`}
            >

                <item.icon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                {text ? text : 'Copy to clipboard'}
            </button>
        </>
    )
}
