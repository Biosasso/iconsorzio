import { DateTime } from "datetime-next";
import DatePicker, { registerLocale } from "react-datepicker";
import it from 'date-fns/locale/it';
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function Table({
    esameExist,
    selectedDay,
    setSelectedDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    selectedType,
    setSelectedType,
    selectedIstruttore,
    setSelectedIstruttore,
    istruttori,
    insegnanti,
    istruttoriinsegnanti,
    workplaces,
    selectedWorkplace,
    setSelectedWorkplace
}) {

    DateTime.setDefaultLocale('it-IT');

    registerLocale('it', it)

    const filterPassedTime = (time) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);

        return currentDate.getTime() < selectedDate.getTime();
    };

    return (
        <div>
            <div className="grid grid-cols-4 gap-6">
                <div className="col-span-1 sm:col-span-1 print:hidden">
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700">
                        Tipo
                    </label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        defaultValue={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value={'primo_esame'}>Esame</option>
                        <option value={'preesame'}>Pre Esame</option>
                    </select>
                </div>
                <div className="col-span-1 sm:col-span-1 print:hidden">
                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                        Seleziona data
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm ">
                        <DatePicker
                            locale={'it'}
                            selected={selectedDay}
                            onChange={(e) => setSelectedDay(e)}
                            // excludeTimes={disponibilita}
                            minDate={new Date()}
                            dateFormat="P"
                            timeIntervals={30}
                            disabledKeyboardNavigation
                            // withPortal
                            // disabled={!readonly ? (serviziData?.tariffaId ? false : true) : true}
                            // placeholderText={serviziData?.tariffaId ? 'Seleziona una data' : "Seleziona prima un veicolo"}
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                        </div>
                    </div>
                </div>
                <div className="col-span-1 sm:col-span-1 print:hidden">
                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                        Ora inizio
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm ">
                        <DatePicker
                            locale={'it'}
                            selected={startTime}
                            onChange={(e) => setStartTime(e)}
                            showTimeSelect
                            // filterTime={filterPassedTime}
                            minTime={new Date(new DateTime(new Date).setHour(8).setMinute(0))}
                            maxTime={new Date(new DateTime(new Date).setHour(20).setMinute(0))}
                            timeFormat="p"
                            dateFormat="p"
                            showTimeSelectOnly
                            timeCaption="Time"
                            timeIntervals={30}
                            disabledKeyboardNavigation
                            // withPortal
                            // disabled={!readonly ? (serviziData?.tariffaId ? false : true) : true}
                            // placeholderText={serviziData?.tariffaId ? 'Seleziona una data' : "Seleziona prima un veicolo"}
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                        </div>
                    </div>
                </div>
                <div className="col-span-1 sm:col-span-1 print:hidden">
                    <label htmlFor="immatricolazione" className="block text-sm font-medium text-gray-700">
                        Ora fine
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm ">
                        <DatePicker
                            locale={'it'}
                            selected={endTime}
                            onChange={(e) => setEndTime(e)}
                            showTimeSelect
                            // filterTime={filterPassedTime}
                            minTime={startTime}
                            maxTime={new Date(new DateTime(new Date).setHour(20).setMinute(0))}
                            timeFormat="p"
                            dateFormat="p"
                            showTimeSelectOnly
                            timeCaption="Time"
                            timeIntervals={30}
                            disabledKeyboardNavigation
                            // withPortal
                            // disabled={!readonly ? (serviziData?.tariffaId ? false : true) : true}
                            // placeholderText={serviziData?.tariffaId ? 'Seleziona una data' : "Seleziona prima un veicolo"}
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <CalendarIcon className="h-5 w-5 text-gray-700 z-40" aria-hidden="true" />
                        </div>
                    </div>
                </div>

                <div className="col-span-2 sm:col-span-2">
                    <label htmlFor="istruttoreId" className="block text-sm font-medium text-gray-700">
                        Seleziona istruttore / insegnante
                    </label>
                    <select
                        name="istruttoreId"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                        value={selectedIstruttore}
                        onChange={(e) => setSelectedIstruttore(e.target.value)}
                    >
                        <option value={'Seleziona'}>Seleziona...</option>
                        {istruttori && istruttori.map(item => (
                            <option value={item.user.id} key={item.id}>{item.user.profile.firstname + ' ' + item.user.profile.lastname}</option>
                        ))}
                        {insegnanti && insegnanti.map(item => (
                            <option value={item.user.id} key={item.id}>{item.user.profile.firstname + ' ' + item.user.profile.lastname}</option>
                        ))}{istruttoriinsegnanti && istruttoriinsegnanti.map(item => (
                            <option value={item.user.id} key={item.id}>{item.user.profile.firstname + ' ' + item.user.profile.lastname}</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2 sm:col-span-2">
                    <label htmlFor="istruttoreId" className="block text-sm font-medium text-gray-700">
                        Seleziona workplace
                    </label>
                    <select
                        name="workplace"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md uppercase"
                        value={selectedWorkplace}
                        onChange={(e) => setSelectedWorkplace(e.target.value)}
                    >
                        <option value={'Seleziona'}>Seleziona...</option>
                        {workplaces && workplaces.map(item => (
                            <option value={item.id} key={item.id}>{item.nome}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}