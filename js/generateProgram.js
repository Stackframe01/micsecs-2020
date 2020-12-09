const generateProgram = async () => {
    fetch('./program.json')
        .then(res => res.json())
        .then(program => {
                let buttons = program.map(day => day.day).map((day, index) => `<a data-toggle="list" role="tab" href="#day${day.replace(/\./g, "")}" class="list-group-item list-group-item-secondary">Day ${index + 1} (${day})</a>`).join("")
                let headHTML = `<div class="list-group list-group-horizontal-md justify-content-center" role="tablist">
                                    <a id="timetableToggler" data-toggle="list" role="tab" href="#timetable" class="list-group-item list-group-item-secondary active">Schedule</a>
                                    ${buttons}
                                </div>
                                <div class="mt-2 small text-center">All times specified for the Moscow timezone (UTC+3)</div>
                                `

                let tmp = program.map(day => {
                    let newDay = Object.assign({}, day);
                    newDay.events.sort(sortingFn);
                    return newDay
                })
                console.log(tmp);
                let daysHTML = tmp.map(day => `
                <div id="day${day.day.replace(/\./g, "")}" class="tab-pane w-75" role="tabpanel">
                        ${day.events.map(event => {
                        if (event.type.toLowerCase() == 'section') {
                            return `
                                <hr/>
                                <h2>${event.title}</h2>
                                <div class="text-left">
                                    <span class="h4">Time: ${event.time}</span>
                                    ${event.room ? `<span class="float-right btn-sm mb-2"><a target="_blank" rel="noopener noreferrer" class="btn ${event.link ? "btn-info" : "btn-secondary disabled"}"  ${event.link ? `href=" ${event.link}"`: ""}> ${event.room} </a></span>` : ""}
                                </div>
                                ${event.chairman ? `<h4 class="text-left">Chairman: ${event.chairman}</h4>` : ""}
                                ${event["vice-chairman"] ? `<h4 class="text-left">Vice-Chairman: ${event["vice-chairman"]}</h4>` : ""}
                                ${event.commentary ? `<div>${event.commentary}</div>` : ""}
                                <ol>
                                    ${event.presentations.map(presentation => `
                                        <br/>
                                        <li>
                                            <div class="clearfix">
                                                <span >${presentation.theme}</span>
                                            </div>
                                            <div>
                                                <em>${presentation.authors}</em>
                                                <div class="float-right">
                                                    <span data-toggle="tooltip" data-placement="top" title="${language[presentation.lang]}" class="badge badge-info">${presentation.lang}</span>
                                                    <span data-toggle="tooltip" data-placement="top" title="${time[presentation.time]}" class="badge badge-info">${presentation.time}</span>
                                                </div>
                                            </div>
                                        </li>
                                    `).join("")}
                                </ol>
                        `
                        } else {
                            return `<hr/>
                            <div class="text-center">
                                <div class="text-center font-weight-bold h3 ">
                                    ${event.time}
                                </div>
                                <h4 class="text-center">
                                    ${event.title}
                                    ${event.lang ? `<div  data-toggle="tooltip" data-placement="top" title="${event.lang ? language[event.lang] : ''}" class="badge badge-info text-center">${event.lang}</div>` : ""}
                                </h4>
                                ${event.room ? `<div><a target="_blank" rel="noopener noreferrer" class="btn btn-sm mb-2 ${event.link ? "btn-info" : "btn-secondary disabled"}"  ${event.link ? `href=" ${event.link}"`: ""}> ${event.room} </a></div>` : ""}
                                <div class="d-xs-block d-md-flex align-items-center justify-content-center">
                                    <div class="text-center w-50 day">
                                        ${event.author ? `<h5 class="text-center">${event.author}</h5>` : ""}
                                        ${event.organization ? `<h5 class="text-center">${event.organization}</h5>` : ""}
                                        ${event.photo ? `<img src="img/${event.photo}" class="schedule-img my-2 img-fluid text-center" alt="Photo of ${event.author}"/>` : ""}
                                    </div>
                                    ${event.annotation ? `<div class="ml-md-5 w-50 text-left day">${event.annotation}</div>` : ""}
                                </div>
                                <br/>
                            </div>`
                        }
                    }).join("")}
                </div>
                `
                ).join("");

                let tmp1 = program.map(day => {
                    let tmpArrray = [...day.events]
                    tmpArrray.sort(sortingFn);
                    for (let eventIndex in tmpArrray) {
                        let newEvent = Object.assign({}, day.events[eventIndex]);
                        newEvent.date = day.day;
                        let newIndex = 0;
                        for (let i = 0; i <= tmpArrray.length; i++) {
                            if (Array.isArray(tmpArrray[i])) {
                                newIndex += 1;
                            }
                        }
                        if (eventIndex != 0 && tmpArrray[eventIndex].time.split('-')[0] == tmpArrray[newIndex - 1][0].time.split('-')[0]) {
                            tmpArrray[newIndex - 1] = [...tmpArrray[newIndex - 1], newEvent];
                            delete tmpArrray[eventIndex];
                        } else {
                            delete tmpArrray[eventIndex];
                            tmpArrray[newIndex] = [newEvent]
                        }
                    }
                    return tmpArrray.filter(el => el != null)
                })
                let tableDailyFragmentHTML = tmp1.map(day => `
                    <tr><td class="d-table-cell d-sm-none text-center font-weight-bold" colspan="3">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td></tr>
                    ${day.map((events, index, array) => {
                    if (array.indexOf(events) == 0) {
                        if (events.length == 1) {
                            if (events[0].type.toLowerCase() == "section") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                    <td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? ` ${events[0].time}`: ""} <br/> ${events[0].chairman ? `Chairman: ${events[0].chairman}` : ''}" class="text-center" colspan="2">${events[0].title} <span class="float-left ml-1">${roomLabel(events[0])} ${ langLabel(events[0])}</span>  </td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "event") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                    <td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>
                                    <td class="text-center font-weight-bold">${events[0].title} <span class="float-left ml-1">${roomLabel(events[0])} ${ langLabel(events[0])}</span> </td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "speech") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                    <td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? events[0].time : ''}" class="text-center"> <span class="float-left ml-1">${roomLabel(events[0])} ${ langLabel(events[0])}</span> <div class="font-weight-bold">${events[0].title}</div>${events[0].author} (${events[0].organization})    </td>
                                </tr>`
                            }
                        } else {
                            events.sort(prioritySorting);
                            let time = `<td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>`
                            let string = `
                            <td>
                            <div class="d-flex justify-content-around">
                                ${events.reduce((accumulator, event, index,array) => {
                                if (index == 0) {
                                    return accumulator += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${event.time ? event.time : ''} <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center pl-0"><span class="float-left ml-1">${roomLabel(event)} ${ langLabel(event)}</span><div class="font-weight-bold ">${event.title}</div> ${event.author ? event.author : ""} ${event.organization ? `(${event.organization})` : ""}  </div>`
                                } else {
                                    return accumulator += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${event.time ? event.time : ''} <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center border-left ${index == array.length-1 ? 'pr-0' : ""}"> <span class="float-left ml-1">${roomLabel(event)} ${ langLabel(event)}</span>  <div class="font-weight-bold">${event.title}</div>  ${event.author ? event.author : ""} ${event.organization ? `(${event.organization})` : ""} </div>`
                                }
                            }, ``)}
                            </div></td>`
                            return `
                            <tr>
                                <td class="d-none d-sm-table-cell" rowspan="${day.length}">${day[0][0].date} <br/> (Day ${tmp1.indexOf(day) + 1})</td>
                                ${time}
                                ${string}
                            </tr>
                        `
                        }
                    } else {
                        if (events.length == 1) {
                            if (events[0].type.toLowerCase() == "section") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? `${events[0].time}`: ""} <br/> ${events[0].chairman ? `Chairman: ${events[0].chairman}` : ''}" class="text-center" colspan="2">  <span class="float-left ml-1">${roomLabel(events[0])} ${ langLabel(events[0])}</span> ${events[0].title}   </td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "event") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>
                                    <td class="text-center font-weight-bold">${events[0].title} <span class="float-left ml-1">${roomLabel(events[0])} ${ langLabel(events[0])}</span>   </td>
                                </tr>
                            `
                            } else if (events[0].type.toLowerCase() == "speech") {
                                return `
                                <tr>
                                    <td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>
                                    <td data-toggle="tooltip" data-placement="top" data-html="true" title="${events[0].time ? `${events[0].time}`: ""}"  class="text-center"><span class="float-left ml-1">${roomLabel(events[0])} ${ langLabel(events[0])}</span><div class="font-weight-bold">${events[0].title}</div>${events[0].author} (${events[0].organization})    </td>
                                </tr>`
                            }
                        } else {
                            events.sort(prioritySorting);
                            let time = `<td class="d-none d-sm-table-cell">${events[0].tableTime ? events[0].tableTime : events[0].time}</td>`
                            let string = `
                            <td>
                            <div class="d-flex justify-content-around">
                                ${events.reduce((accumulator, event, index, array) => {
                                if (index == 0) {
                                    var buf = "";
                                    buf += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${ event.type != "Event" ? (event.time ? event.time : "") : ""} <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center clearfix pl-0">`
                                         + `<span class="float-left ml-1">${roomLabel(event)}`
                                         + `${ langLabel(event) }</span>`                                         
                                         + `<span class="font-weight-bold">${event.title}</span>`
                                         + `${event.author ? `<br/>${event.author}` : ""} ${event.organization ? `(${event.organization})` : ""}`
                                         + `</div>`
                                    return accumulator += buf;
                                } else {
                                    var buf = "";
                                    buf += `<div data-toggle="tooltip" data-placement="top" data-html="true" title="${ event.type != "Event" ? (event.time ? event.time : "") : ""}  <br/> ${event.chairman ? `Chairman: ${event.chairman}` : ''}" class="col-xs-12 col-lg text-center border-left clearfix ${index == array.length-1 ? "pr-0" : ""}">`
                                         + `<span class="float-left ml-1">${roomLabel(event)}`
                                         + `${ langLabel(event) }</span>`                                         
                                         + `<span class="font-weight-bold">${event.title}</span>`
                                         + `${event.author ? `<br/>${event.author}` : ""} ${event.organization ? `(${event.organization})` : ""}` 
                                         + `</div>`
                                    return accumulator += buf;
                                }
                            }, ``)}
                            </div></td>`
                            return `
                            <tr>
                                ${time}
                                ${string}
                            </tr>
                        `
                        }
                    }
                }).join("")}
                `).join("")
                let timetableHTML = `<br/><div><table class="table table-bordered">
                    <tr>
                        <th class="d-none d-sm-table-cell">Date</th>
                        <th class="d-none d-sm-table-cell">Time</th>
                        <th class="text-center">Activity</th>
                    </tr>
                    ${tableDailyFragmentHTML}
                </table></div>`;


                let bodyHTML = `<div class="tab-content d-flex justify-content-center">
                                    <div id="timetable" class="tab-pane active" role="tabpanel">
                                        ${timetableHTML}
                                    </div>
                                   
                                    ${daysHTML}
                                </div>`
                let fullHTML = headHTML + bodyHTML
                return document.querySelector('#data').insertAdjacentHTML('afterbegin', fullHTML);
            }
        ).then(() => {
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip({container: document.body});
        });

    })
};

generateProgram()

function langLabel(o) {
    if (!o.lang) return "";
    return `<div class="">`
        + `<span data-toggle="tooltip" data-placement="bottom" title="${language[o.lang]}" class="badge badge-info">${o.lang}</span>`
        + `</div>`
}

function roomLabel(o) {
    if (!o.room) return "";
    return `<span class="float-left">`
        + `<span data-toggle="tooltip" data-placement="bottom" title="${o.room}" class="badge badge-success">${o.link ? `<a target="_blank" rel="noopener noreferrer" class="text-white" href=${o.link}>${o.room.split(" ")[1]}</a>` : `${o.room.split(" ")[1]}`}</span>`
        + `</span>`
}
let language = {
    en: 'English only',
    ru: 'Russian only',
    "en+ru": 'English with translation to Russian',
    "ru+en": 'Russian with translation to English',
    "ru&en": 'Russian and English language',
    "en&ru": 'English and Russian language'
}

let time = {
    long: "10 min - speech, 5 min - questions",
    short: "5 min - speech, 5 min - questions",
}


let sortingFn = (a, b) => {
    if(a.time.split('-')[0] != b.time.split('-')[0]) {
        return a.time.split('-')[0] > b.time.split('-')[0] ? 1 : -1
    } else {
        return a.track > b.track ? 1 : -1
    }
}
let prioritySorting = (a,b) => {
    a.track = a.track ? a.track : 0;
    b.track = b.track ? b.track : 0;
    return a.track > b.track ? 1 : -1
}
