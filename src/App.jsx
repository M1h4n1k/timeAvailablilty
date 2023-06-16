import { useState } from 'react'


function PopupWindow({hour, activity, closePopup, changeActivity}) {
    return (
        <div id="popup" className="z-20 h-full w-full !m-0 !p-0 absolute top-0 left-0 text-black" style={{ background: 'rgba(0, 0, 0, .5)' }}
             onClick={closePopup}>
            <label onClick={(e) => e.stopPropagation()}
                   className="absolute top-1/2 left-1/2 bg-gray-100 rounded-xl h-64 w-96 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center justify-center p-6 space-y-2">
                <h3>What are you doing this time?</h3>
                <textarea
                    className="w-full h-32 p-2 outline-none border rounded-lg resize-none" placeholder="Tell what you are doing in a couple of words..."
                    value={activity}
                    onChange={(e) => changeActivity(e.target.value, hour)}
                ></textarea>
                <button
                    className="bg-emerald-400 font-semibold rounded px-4 py-2 text-white hover:bg-emerald-300 transition active:scale-90"
                    onClick={closePopup}
                >
                    Submit
                </button>
            </label>
        </div>
    )
}


function ActivityTextBox({hour, openEditActivityPopup, activity, isBetween}){
    return (
        <span className={
                "absolute -top-7 md:-top-9 lg:-top-11 border-2 rounded-xl h-6 md:h-7 lg:h-8 w-24 md:w-36 lg:w-44 flex items-center justify-center z-10 dark:text-white " +
                "text-xs md:text-sm lg:text-base" +
                (isBetween(hour) === 2 ? 'translate-x-4 md:translate-x-6 lg:translate-7' : '')
            }
            onMouseDown={(e) => openEditActivityPopup(e, hour)}
        >{
            activity || 'What are you doing?'
        }</span>
    )
}


function HourBlock({freeTime, hour, activity, openEditActivityPopup, timePress, timeOver}) {

    function isBetween(){  // check if hour is between any of free ranges
        if (freeTime.length === 0 && hour === 11) {
            return 2
        }

        for (let i = 0; i < freeTime.length; i++) {
            if (i === 0) {
                if (freeTime[i].start - 2 * hour - 1 === 0) {
                    return 1
                }
                if (freeTime[i].start - 2 * hour - 1 === 1) {
                    return 2
                }
            }
            if(i === freeTime.length - 1) {
                if (2 * hour - freeTime[i].end - 24 === 0) {
                    return 1
                }
                if (2 * hour - freeTime[i].end - 24 === -1) {
                    return 2
                }
            }
            if (i !== 0 && 2 * hour - freeTime[i].start - freeTime[i - 1].end === 0) {
                return 1
            }
            if (i !== 0 && 2 * hour - freeTime[i].start - freeTime[i - 1].end === -1) {
                return 2
            }
        }
        return 0
    }
    return (
        <div
            className={
                "first:rounded-l-[100%] last:rounded-r-[100%] w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 relative dark:text-white " +
                "flex items-center justify-center text-sm select-none cursor-pointer " +
                (freeTime.some((el) => el.start === hour) ? '!bg-green-300 dark:!bg-emerald-400 !rounded-l-full ' : '') +
                (freeTime.some((el) => el.end === hour) ? '!bg-green-300 dark:!bg-emerald-400 !rounded-r-full ' : '') +
                (freeTime.some((el) => el.start < hour && hour < el.end) ? '!bg-green-100 dark:!bg-emerald-200 ' : 'bg-neutral-200 dark:bg-gray-300 ') +
                ((freeTime.some((el) => el.start === hour + 1) || hour === 23)
                && !freeTime.some((el) => el.end === hour) ? '!bg-neutral-300 rounded-r-lg dark:!bg-gray-400 ' : '') +
                ((freeTime.some((el) => el.end === hour - 1) || hour === 0)
                && !freeTime.some((el) => el.start === hour) ? '!bg-neutral-300 dark:!bg-gray-400 rounded-l-lg ' : '')
            }
            onMouseDown={() => timePress(hour)}
            onMouseOver={(e) => timeOver(e, hour)}
            key={`hour-${hour}`}
        >
            <span>{hour}:00</span>
            {
                !freeTime.some((el) => el.start <= hour && hour <= el.end) && isBetween(hour) !== 0 &&
                <ActivityTextBox
                    hour={hour}
                    openEditActivityPopup={openEditActivityPopup}
                    activity={activity}
                    isBetween={isBetween}
                ></ActivityTextBox>
            }
        </div>
    )
}


function AddButton({addNewRange}) {
    return (
        <div onClick={addNewRange} className="text-5xl font-bold cursor-pointer active:scale-75 transition-all w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 122.875 122.648" className="dark:fill-white">
                <path d="M108.993,47.079c7.683-0.059,13.898,6.12,13.882,13.805 c-0.018,7.683-6.26,13.959-13.942,14.019L75.24,75.138l-0.235,33.73c-0.063,7.619-6.338,13.789-14.014,13.78 c-7.678-0.01-13.848-6.197-13.785-13.818l0.233-33.497l-33.558,0.235C6.2,75.628-0.016,69.448,0,61.764 c0.018-7.683,6.261-13.959,13.943-14.018l33.692-0.236l0.236-33.73C47.935,6.161,54.209-0.009,61.885,0 c7.678,0.009,13.848,6.197,13.784,13.818l-0.233,33.497L108.993,47.079L108.993,47.079z"/>
            </svg>
        </div>
    )
}

function DeleteButton({deleteRange}) {
    return (
        <div onClick={deleteRange} className="text-5xl font-bold cursor-pointer active:scale-75 transition-all w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 122.875 28.489" className="dark:fill-white">
                <path d="M108.993,0c7.683-0.059,13.898,6.12,13.882,13.805 c-0.018,7.682-6.26,13.958-13.942,14.018c-31.683,0.222-63.368,0.444-95.051,0.666C6.2,28.549-0.016,22.369,0,14.685 C0.018,7.002,6.261,0.726,13.943,0.667C45.626,0.445,77.311,0.223,108.993,0L108.993,0z"/>
            </svg>
        </div>
    )
}


function ToggledDarkModeButton(){
    function toggleMode(){
        if (localStorage.getItem('color-theme') === 'dark') {
            localStorage.setItem('color-theme', 'light');
            document.documentElement.classList.remove('dark');
        } else {
            localStorage.setItem('color-theme', 'dark');
            document.documentElement.classList.add('dark');
        }
    }

    return (
        <button
            id="theme-toggle"
            type="button"
            className="text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-75 transition-all rounded-lg text-sm p-2.5"
            onClick={toggleMode}
        >
            <svg
                id="theme-toggle-dark-icon"
                className="w-5 h-5 dark:hidden"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                ></path>
            </svg>
            <svg
                id="theme-toggle-light-icon"
                className="w-5 h-5 hidden dark:block"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                ></path>
            </svg>
        </button>
    )
}


function Day({name, pressed, setPressed}) {
    function randomRange(min = 0, max = 100) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor( rand * difference);
        rand = rand + min;
        return rand;
    }

    let num1 = randomRange(8, 14), num2 = randomRange(15, 20)

    const [availability, setAvailability] = useState([
        // {
        //     start: 0,
        //     end: num1 - 1,
        //     type: 'busy',
        //     text: 'sleeping'
        // },
        {
            start: num1,
            end: num2,
            type: 'free',
            text: ''
        },
        // {
        //     start: num2 + 1,
        //     end: 23,
        //     type: 'busy',
        //     text: 'working'
        // }
    ])

    const [popup, setPopup] = useState(-1)

    const [pressedFreeSliderEdge, setPressedFreeSliderEdge] = useState(-1)

    function rangeRelativePosition(start, end, hour) {
        if (hour < start)
            return -1
        if (hour > end)
            return 1
        return 0
    }

    function getFreeTime(){
        return availability.filter((item) => item.type === 'free')
    }

    function getBusyTime(){
        return availability.filter((item) => item.type === 'busy')
    }

    function stretchBusyRanges(day){
        day.sort((a, b) => a.start - b.start)
        for (let i = 0; i < day.length; i++) {  // stretch busy ranges
            if (day[i].type !== "busy")
                continue

            if(i !== 0) {
                day[i].start = day[i - 1].end + 1
            }
            if (i !== day.length - 1) {
                day[i].end = day[i + 1].start - 1
            }

            if (day[i].start > day[i].end) {
                day.splice(i, 1)
                i--
            }
        }
        // I have only a few ranges, so I can sort them every time for simplicity,
        // but if I had a lot of ranges, I would have used a more efficient data structure
        day.sort((a, b) => a.start - b.start)
        return day
    }

    function timePress(hour){
        let freeTime = getFreeTime()
        for (let i = 0; i < freeTime.length; i++) {
            if (hour === freeTime[i].start){
                setPressedFreeSliderEdge(i * 2)
                setPressed(true)
                break
            } else if (hour === freeTime[i].end) {
                setPressedFreeSliderEdge(i * 2 + 1)
                setPressed(true)
                break
            }
        }
        if (freeTime.length !== 1)
            return

        if (rangeRelativePosition(freeTime[0].start, freeTime[0].end, hour) === -1) {
            freeTime[0].start = hour
        } else if (rangeRelativePosition(freeTime[0].start, freeTime[0].end, hour) === 1) {
            freeTime[0].end = hour
        } else {
            if (hour - freeTime[0].start < freeTime[0].end - hour) {
                freeTime[0].start = hour
            } else {
                freeTime[0].end = hour
            }
        }

        let day = stretchBusyRanges(freeTime.concat(getBusyTime()))

        setAvailability(day)
    }

    function timeOver(event, hour){
        if(!pressed){
            setPressedFreeSliderEdge(-1)
            setPressed(false)
            return
        }
        if (pressedFreeSliderEdge === -1)
            return
        event.preventDefault();

        let freeTime = getFreeTime('monday')
        const rangeInd = Math.floor(pressedFreeSliderEdge / 2)
        if (pressedFreeSliderEdge % 2 === 0) {  // if start is pressed
            freeTime[rangeInd].start = Math.min(hour, freeTime[rangeInd].end);
        }
        else if (pressedFreeSliderEdge % 2 === 1) {  // if end is pressed
            freeTime[rangeInd].end = Math.max(hour, freeTime[rangeInd].start);
        }

        let day = stretchBusyRanges(freeTime.concat(getBusyTime('monday')))


        // if any of free ranges are intersected - merge them
        for (let i = 0; i < freeTime.length; i++) {
            if (i === rangeInd)
                continue
            if (
                freeTime[i].start <= freeTime[rangeInd].start && freeTime[rangeInd].start <= freeTime[i].end ||
                freeTime[i].start <= freeTime[rangeInd].end && freeTime[rangeInd].end <= freeTime[i].end
            ) {
                freeTime[i].start = Math.min(freeTime[i].start, freeTime[rangeInd].start)
                freeTime[i].end = Math.max(freeTime[i].end, freeTime[rangeInd].end)
                freeTime.splice(rangeInd, 1)

                day = freeTime.concat(getBusyTime())

                setPressedFreeSliderEdge(-1)
                setPressed(false)
                break
            }
        }

        day.sort((a, b) => a.start - b.start)
        setAvailability(day)

    }

    function addNewRange(){
        let freeTime = getFreeTime()
        let busyTime = getBusyTime()

        let start = 0
        let end = 0
        for (let i = 0; i < freeTime.length; i++) {
            if (i === 0 && freeTime[i].start !== 0) {
                end = freeTime[i].start - 1
            }
            if (i !== 0 && end - start <= freeTime[i].start - freeTime[i - 1].end - 2 && freeTime[i].start - freeTime[i - 1].end > 1) {
                start = freeTime[i - 1].end + 1
                end = freeTime[i].start - 1
            }
            if (i === freeTime.length - 1) {
                if (end - start < 23 - freeTime[i].end && freeTime[i].end !== 23) {
                    start = freeTime[i].end + 1
                    end = 23
                }
            }
        }
        // if there is no place to add a new range
        if(start === 0 && end === 0 && freeTime.length !== 0) {
            return
        }

        if (freeTime.length === 0) {
            start = 12
            end = 15
        }
        freeTime.push({
            start: start,
            end: end,
            type: 'free'
        })

        // delete busy ranges that are intersected with new free range
        for (let i = 0; i < busyTime.length; i++) {
            if (
                busyTime[i].start <= end && busyTime[i].end >= end ||
                busyTime[i].start <= start && busyTime[i].end >= start ||
                busyTime[i].start >= start && busyTime[i].end <= end
            ) {
                busyTime.splice(i, 1)
                i--
            }
        }
        let day = freeTime.concat(busyTime)
        day.sort((a, b) => a.start - b.start)
        setAvailability(day)
    }

    function deleteRange(){
        let freeTime = getFreeTime()
        let lastElement = freeTime.pop()
        let day = freeTime.concat(getBusyTime())
        for (let i = 0; i < day.length; i++) {  // I don't know how to decide which range I should stretch, so I delete both and let the user recreate it
            if(
                (day[i].end + 1 === lastElement.start || day[i].start - 1 === lastElement.end)
                && day[i].type === 'busy'
            ) {
                day.splice(i, 1)
                i--;
            }
        }

        day.sort((a, b) => a.start - b.start)

        setAvailability(day)
    }

    function openEditActivityPopup(event, hour){
        event.preventDefault()
        event.stopPropagation()
        setPopup(hour)
    }

    function getActivity(hour){
        let busyTime = getBusyTime()
        for (let i = 0; i < busyTime.length; i++) {
            if (busyTime[i].start <= hour && hour <= busyTime[i].end) {
                return busyTime[i].text
            }
        }
        return ''
    }

    function changeActivity(text, hour){
        let busyTime = getBusyTime()
        for (let i = 0; i < busyTime.length; i++) {
            if (busyTime[i].start <= hour && hour <= busyTime[i].end) {
                busyTime[i].text = text

                let day = busyTime.concat(getFreeTime())
                day.sort((a, b) => a.start - b.start)
                setAvailability(day)
                return
            }
        }

        let start = -1, end = -1;
        let freeTime = getFreeTime()
        if(freeTime.length === 0){
            start = 0
            end = 23
        } else {
            for (let i = 0; i < freeTime.length; i++) {
                if (i === 0 && 0 <= hour && hour < freeTime[i].start) {
                    start = 0
                    end = freeTime[i].start - 1
                }
                if (i === freeTime.length - 1 && freeTime[i].end < hour && hour <= 23) {
                    start = freeTime[i].end + 1
                    end = 23
                }
                if (i !== 0 && freeTime[i - 1].end < hour && hour < freeTime[i].start) {
                    start = freeTime[i - 1].end + 1
                    end = freeTime[i].start - 1
                }
            }
        }
        let day = availability
        day.push({
            start: start,
            end: end,
            type: 'busy',
            text: text
        })
        day.sort((a, b) => a.start - b.start)
        setAvailability([...day])  // for some reason react doesn't want to update element without spread operator
    }

    return (
        <>
        <div className="flex space-x-3 items-center justify-end"
            onMouseUp={() => {
                setPressedFreeSliderEdge(-1)
                setPressed(false)
            }}
        >
            <h4 className="text-xl text-center grow ">{name}</h4>
            <div className="flex bg-gray-100 rounded-full p-2 dark:bg-gray-200">
                {
                    Array.from({ length: 24 }, (_, hour) => (
                        <HourBlock
                            key={hour}
                            freeTime={getFreeTime()}
                            hour={hour}
                            activity={getActivity(hour)}
                            openEditActivityPopup={openEditActivityPopup}
                            timePress={timePress}
                            timeOver={timeOver}
                        />
                    ))
                }
            </div>
            <div className="flex flex-col">
                <AddButton addNewRange={addNewRange} />
                <DeleteButton deleteRange={deleteRange} />
            </div>
        </div>

        {
            popup !== -1 &&
            <PopupWindow
                hour={popup}
                activity={getActivity(popup)}
                closePopup={() => setPopup(-1)}
                changeActivity={changeActivity}
            />
        }
        </>
    )
}


function App() {
    let [pressedFreeSliderEdge, setPressedFreeSliderEdge] = useState(false)

    function shift(arr, n) {
        return arr.concat(arr.splice(0, n))
    }

    const d = new Date();
    let day = d.getDay();
    const days = shift(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], day)


    return (
        <div
            className="px-56 space-y-14 h-full w-full dark:text-white"
            onMouseUp={() => setPressedFreeSliderEdge(false)}
        >
            <div className="w-full flex justify-between ">
                <h2 className="text-2xl dark:text-white">My availability for the next 7 days</h2>
                <ToggledDarkModeButton/>
            </div>

            {
                days.map((name, index) => (
                    <Day
                        key={index}
                        name={name}
                        pressed={pressedFreeSliderEdge}
                        setPressed={setPressedFreeSliderEdge}
                    />
                ))
            }

        </div>
    )
}

export default App
